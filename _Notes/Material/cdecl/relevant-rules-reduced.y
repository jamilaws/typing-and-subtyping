
%union {
	char *dynstr;
	struct {
		char *left;
		char *right;
		char *type;
	} halves;
}

%token ARRAY AS COMMA FUNCTION
%token OF POINTER REFERENCE RETURNING TO
%token <dynstr> CHAR FLOAT INT NAME
%token <dynstr> NUMBER STRUCT VOID
%type <dynstr> adecllist
%type <dynstr> constvol_list
%type <dynstr> opt_constvol_list   
%type <dynstr> tname type
%type <halves> adecl

%start adecl // prog

%%

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

adecl: FUNCTION '(' adecllist ')' RETURNING adecl
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

tname		: INT | CHAR | FLOAT | VOID;

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