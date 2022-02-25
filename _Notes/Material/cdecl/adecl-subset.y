
%union {
	char *dynstr;
	struct {
		char *left;
		char *right;
		char *type;
	} halves;
}

%token ARRAY AS COMMA DECLARE FUNCTION BLOCK
%token OF MEMBER POINTER REFERENCE RETURNING SET TO
%token <dynstr> CHAR CLASS DOUBLE FLOAT INT NAME
%token <dynstr> NUMBER SHORT SIGNED STRUCT UNION UNSIGNED VOID
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