%{
/* Yacc grammar for ANSI and C++ cdecl. */
/* The output of this file is included */
/* into the C file cdecl.c. */
char cdgramsccsid[] = "@(#)cdgram.y	2.2 3/30/88";
%}

%union {
	char *dynstr;
	struct {
		char *left;
		char *right;
		char *type;
	} halves;
}

%token ARRAY AS CAST COMMA DECLARE DOUBLECOLON EXPLAIN FUNCTION BLOCK
%token HELP INTO OF MEMBER POINTER REFERENCE RETURNING SET TO
%token <dynstr> CHAR CLASS CONSTVOLATILE DOUBLE ENUM FLOAT INT LONG NAME
%token <dynstr> NUMBER SHORT SIGNED STRUCT UNION UNSIGNED VOID
%token <dynstr> AUTO EXTERN REGISTER STATIC
%type <dynstr> adecllist adims c_type cast castlist cdecl cdecl1 cdims
%type <dynstr> constvol_list ClassStruct mod_list mod_list1 modifier
%type <dynstr> opt_constvol_list optNAME opt_storage storage StrClaUniEnum
%type <dynstr> tname type
%type <halves> adecl

%start prog

%%
prog		: /* empty */
		| prog stmt
			{
			prompt();
			prev = 0;
			}
		;

stmt		: DECLARE NAME AS opt_storage adecl NL
			{
			dodeclare($2, $4, $5.left, $5.right, $5.type);
			}

		| DECLARE opt_storage adecl NL
			{
			dodeclare(NullCP, $2, $3.left, $3.right, $3.type);
			}

		| NL
		| error NL
			{
			yyerrok;
			}
		;

NL		: '\n'
			{
			doprompt();
			}
		| ';'
			{
			noprompt();
			}
		;

optNAME		: NAME
			{
			$$ = $1;
			}

		| /* empty */
			{
			$$ = ds(unknown_name);
			}
		;

cdecl		: cdecl1
		| '*' opt_constvol_list cdecl
			{
			$$ = cat($3,$2,ds(strlen($2)?" pointer to ":"pointer to "),NullCP);
			prev = 'p';
			}

		| NAME DOUBLECOLON '*' cdecl
			{
			if (!CplusplusFlag)
				unsupp("pointer to member of class", NullCP);
			$$ = cat($4,ds("pointer to member of class "),$1,ds(" "),NullCP);
			prev = 'p';
			}

		| '&' opt_constvol_list cdecl
			{
			if (!CplusplusFlag)
				unsupp("reference", NullCP);
			$$ = cat($3,$2,ds(strlen($2)?" reference to ":"reference to "),NullCP);
			prev = 'r';
			}
		;

cdecl1		: cdecl1 '(' ')'
			{
			$$ = cat($1,ds("function returning "),NullCP);
			prev = 'f';
			}
                        
                | '(' '^' opt_constvol_list cdecl ')' '(' ')'
                        {
                            char *sp = "";
                            if (strlen($3) > 0)
                                sp = " ";
                            $$ = cat($4, $3, ds(sp), ds("block returning "), NullCP);
                            prev = 'b';
                        }
                        
                | '(' '^' opt_constvol_list cdecl ')' '(' castlist ')'
                        {
                            char *sp = "";
                            if (strlen($3) > 0)
                                sp = " ";
                            $$ = cat($4, $3, ds(sp), ds("block ("),
                                    $7, ds(") returning "), NullCP);
                            prev = 'b';
                        }

		| cdecl1 '(' castlist ')'
			{
			$$ = cat($1, ds("function ("),
				  $3, ds(") returning "), NullCP);
			prev = 'f';
			}

		| cdecl1 cdims
			{
			$$ = cat($1,ds("array "),$2,NullCP);
			prev = 'a';
			}

		| '(' cdecl ')'
			{
			$$ = $2;
			/* prev = prev; */
			}

		| NAME
			{
			savedname = $1;
			$$ = ds("");
			prev = 'n';
			}
		;

castlist	: castlist COMMA castlist
			{
			$$ = cat($1, ds(", "), $3, NullCP);
			}

		| opt_constvol_list type cast
			{
			$$ = cat($3, $1, ds(strlen($1) ? " " : ""), $2, NullCP);
			}

		| NAME
			{
			$$ = $1;
			}
		;

adecllist	: /* empty */
			{
			$$ = ds("");
			}

		| adecllist COMMA adecllist
			{
			$$ = cat($1, ds(", "), $3, NullCP);
			}

		| NAME
			{
			$$ = $1;
			}

		| adecl
			{
			$$ = cat($1.type, ds(" "), $1.left, $1.right, NullCP);
			}

		| NAME AS adecl
			{
			$$ = cat($3.type, ds(" "), $3.left, $1, $3.right, NullCP);
			}
		;

cast		: /* empty */
			{
			$$ = ds("");
			/* prev = prev; */
			}

		| '(' ')'
			{
			$$ = ds("function returning ");
			prev = 'f';
			}

		| '(' cast ')' '(' ')'
			{
			$$ = cat($2,ds("function returning "),NullCP);
			prev = 'f';
			}

		| '(' cast ')' '(' castlist ')'
			{
			$$ = cat($2,ds("function ("),$5,ds(") returning "),NullCP);
			prev = 'f';
			}
                        
                | '(' '^' cast ')' '(' ')'
                    {
			$$ = cat($3,ds("block returning "),NullCP);
			prev = 'b';
                    }
                    
                | '(' '^' cast ')' '(' castlist ')'
                    {
			$$ = cat($3,ds("block ("), $6, ds(") returning "),NullCP);
			prev = 'b';
                    }

		| '(' cast ')'
			{
			$$ = $2;
			/* prev = prev; */
			}

		| NAME DOUBLECOLON '*' cast
			{
			if (!CplusplusFlag)
				unsupp("pointer to member of class", NullCP);
			$$ = cat($4,ds("pointer to member of class "),$1,ds(" "),NullCP);
			prev = 'p';
			}

		| '*' cast
			{
			$$ = cat($2,ds("pointer to "),NullCP);
			prev = 'p';
			}

		| '&' cast
			{
			if (!CplusplusFlag)
				unsupp("reference", NullCP);
			$$ = cat($2,ds("reference to "),NullCP);
			prev = 'r';
			}

		| cast cdims
			{
			$$ = cat($1,ds("array "),$2,NullCP);
			prev = 'a';
			}
		;

cdims		: '[' ']'
			{
			$$ = ds("of ");
			}

		| '[' NUMBER ']'
			{
			$$ = cat($2,ds(" of "),NullCP);
			}
		;

adecl		: FUNCTION RETURNING adecl
			{
			if (prev == 'f')
				unsupp("Function returning function",
				       "function returning pointer to function");
			else if (prev=='A' || prev=='a')
				unsupp("Function returning array",
				       "function returning pointer");
			$$.left = $3.left;
			$$.right = cat(ds("()"),$3.right,NullCP);
			$$.type = $3.type;
			prev = 'f';
			}

		| FUNCTION '(' adecllist ')' RETURNING adecl
			{
			if (prev == 'f')
				unsupp("Function returning function",
				       "function returning pointer to function");
			else if (prev=='A' || prev=='a')
				unsupp("Function returning array",
				       "function returning pointer");
			$$.left = $6.left;
			$$.right = cat(ds("("),$3,ds(")"),$6.right,NullCP);
			$$.type = $6.type;
			prev = 'f';
			}
                        
                
                | opt_constvol_list BLOCK RETURNING adecl
                        {
                        char *sp = "";
			if (prev == 'f')
				unsupp("Block returning function",
				       "block returning pointer to function");
			else if (prev=='A' || prev=='a')
				unsupp("Block returning array",
				       "block returning pointer");
			if (strlen($1) != 0)
				sp = " ";
                        $$.left = cat($4.left, ds("(^"), ds(sp), $1, ds(sp), NullCP);
			$$.right = cat(ds(")()"),$4.right,NullCP);
			$$.type = $4.type;
			prev = 'b';

                        }
                
                | opt_constvol_list BLOCK '(' adecllist ')' RETURNING adecl
                        {
                        char *sp = "";
			if (prev == 'f')
				unsupp("Block returning function",
				       "block returning pointer to function");
			else if (prev=='A' || prev=='a')
				unsupp("Block returning array",
				       "block returning pointer");
                        if (strlen($1) != 0)
                            sp = " ";
                        $$.left = cat($7.left, ds("(^"), ds(sp), $1, ds(sp), NullCP);
			$$.right = cat(ds(")("), $4, ds(")"), $7.right, NullCP);
                        $$.type = $7.type;
                        prev = 'b';
                        }

		| ARRAY adims OF adecl
			{
			if (prev == 'f')
				unsupp("Array of function",
				       "array of pointer to function");
			else if (prev == 'a')
				unsupp("Inner array of unspecified size",
				       "array of pointer");
			else if (prev == 'v')
				unsupp("Array of void",
				       "pointer to void");
			if (arbdims)
				prev = 'a';
			else
				prev = 'A';
			$$.left = $4.left;
			$$.right = cat($2,$4.right,NullCP);
			$$.type = $4.type;
			}

		| opt_constvol_list POINTER TO adecl
			{
			char *op = "", *cp = "", *sp = "";

			if (prev == 'a')
				unsupp("Pointer to array of unspecified dimension",
				       "pointer to object");
			if (prev=='a' || prev=='A' || prev=='f') {
				op = "(";
				cp = ")";
			}
			if (strlen($1) != 0)
				sp = " ";
			$$.left = cat($4.left,ds(op),ds("*"),
				       ds(sp),$1,ds(sp),NullCP);
			$$.right = cat(ds(cp),$4.right,NullCP);
			$$.type = $4.type;
			prev = 'p';
			}

		| opt_constvol_list POINTER TO MEMBER OF ClassStruct NAME adecl
			{
			char *op = "", *cp = "", *sp = "";

			if (!CplusplusFlag)
				unsupp("pointer to member of class", NullCP);
			if (prev == 'a')
				unsupp("Pointer to array of unspecified dimension",
				       "pointer to object");
			if (prev=='a' || prev=='A' || prev=='f') {
				op = "(";
				cp = ")";
			}
			if (strlen($1) != 0)
				sp = " ";
			$$.left = cat($8.left,ds(op),$7,ds("::*"),
				      ds(sp),$1,ds(sp),NullCP);
			$$.right = cat(ds(cp),$8.right,NullCP);
			$$.type = $8.type;
			prev = 'p';
			}

		| opt_constvol_list REFERENCE TO adecl
			{
			char *op = "", *cp = "", *sp = "";

			if (!CplusplusFlag)
				unsupp("reference", NullCP);
			if (prev == 'v')
				unsupp("Reference to void",
				       "pointer to void");
			else if (prev == 'a')
				unsupp("Reference to array of unspecified dimension",
				       "reference to object");
			if (prev=='a' || prev=='A' || prev=='f') {
				op = "(";
				cp = ")";
			}
			if (strlen($1) != 0)
				sp = " ";
			$$.left = cat($4.left,ds(op),ds("&"),
				       ds(sp),$1,ds(sp),NullCP);
			$$.right = cat(ds(cp),$4.right,NullCP);
			$$.type = $4.type;
			prev = 'r';
			}

		| opt_constvol_list type
			{
			$$.left = ds("");
			$$.right = ds("");
			$$.type = cat($1,ds(strlen($1)?" ":""),$2,NullCP);
			if (strcmp($2, "void") == 0)
			    prev = 'v';
			else if ((strncmp($2, "struct", 6) == 0) ||
			         (strncmp($2, "class", 5) == 0))
			    prev = 's';
			else
			    prev = 't';
			}
		;

adims		: /* empty */
			{
			arbdims = 1;
			$$ = ds("[]");
			}

		| NUMBER
			{
			arbdims = 0;
			$$ = cat(ds("["),$1,ds("]"),NullCP);
			}
		;

type		: tinit c_type
			{
			mbcheck();
			$$ = $2;
			}
		;

tinit		: /* empty */
			{
			modbits = 0;
			}
		;

c_type		: mod_list
			{

			$$ = $1;
			}

		| tname
			{
			$$ = $1;
			}

		| mod_list tname
			{
			$$ = cat($1,ds(" "),$2,NullCP);
			}

		| StrClaUniEnum NAME
			{
			$$ = cat($1,ds(" "),$2,NullCP);
			}
		;

StrClaUniEnum	: ClassStruct
		| ENUM
		| UNION
			{
			$$ = $1;
			}
		;

ClassStruct	: STRUCT
		| CLASS
			{
			$$ = $1;
			}
		;

tname		: INT
			{
			modbits |= MB_INT; $$ = $1;
			}

		| CHAR
			{
			modbits |= MB_CHAR; $$ = $1;
			}

		| FLOAT
			{
			modbits |= MB_FLOAT; $$ = $1;
			}

		| DOUBLE
			{
			modbits |= MB_DOUBLE; $$ = $1;
			}

		| VOID
			{
			modbits |= MB_VOID; $$ = $1;
			}
		;

mod_list	: modifier mod_list1
			{
			$$ = cat($1,ds(" "),$2,NullCP);
			}

		| modifier
			{
			$$ = $1;
			}
		;

mod_list1	: mod_list
			{
			$$ = $1;
			}

		| CONSTVOLATILE
			{
			if (PreANSIFlag)
				notsupported(" (Pre-ANSI Compiler)", $1, NullCP);
			else if (RitchieFlag)
				notsupported(" (Ritchie Compiler)", $1, NullCP);
			else if ((strcmp($1, "noalias") == 0) && CplusplusFlag)
				unsupp($1, NullCP);
			$$ = $1;
			}
		;

modifier	: UNSIGNED
			{
			modbits |= MB_UNSIGNED; $$ = $1;
			}

		| SIGNED
			{
			modbits |= MB_SIGNED; $$ = $1;
			}

		| LONG
			{
			modbits |= MB_LONG; $$ = $1;
			}

		| SHORT
			{
			modbits |= MB_SHORT; $$ = $1;
			}
		;

opt_constvol_list: CONSTVOLATILE opt_constvol_list
			{
			if (PreANSIFlag)
				notsupported(" (Pre-ANSI Compiler)", $1, NullCP);
			else if (RitchieFlag)
				notsupported(" (Ritchie Compiler)", $1, NullCP);
			else if ((strcmp($1, "noalias") == 0) && CplusplusFlag)
				unsupp($1, NullCP);
			$$ = cat($1,ds(strlen($2) ? " " : ""),$2,NullCP);
			}

		| /* empty */
			{
			$$ = ds("");
			}
		;

constvol_list: CONSTVOLATILE opt_constvol_list
			{
			if (PreANSIFlag)
				notsupported(" (Pre-ANSI Compiler)", $1, NullCP);
			else if (RitchieFlag)
				notsupported(" (Ritchie Compiler)", $1, NullCP);
			else if ((strcmp($1, "noalias") == 0) && CplusplusFlag)
				unsupp($1, NullCP);
			$$ = cat($1,ds(strlen($2) ? " " : ""),$2,NullCP);
			}
		;

storage		: AUTO
		| EXTERN
		| REGISTER
		| STATIC
			{
			$$ = $1;
			}
		;

opt_storage	: storage
			{
			$$ = $1;
			}

		| /* empty */
			{
			$$ = ds("");
			}
		;
%%