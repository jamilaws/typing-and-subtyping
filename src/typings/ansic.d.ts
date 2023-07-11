
declare module 'ansic' {
    interface Lexer {
      // Methoden und Eigenschaften für den Lexer
      // ...
    }
  
    interface Parser {
      yy: any;
      trace(): void;
      symbols_: { [name: string]: number };
      terminals_: { [number: number]: string };
      productions_: any[];
      performAction(
        yytext: string,
        yyleng: number,
        yylineno: number,
        yy: any,
        yystate: number,
        $$: any,
        _$: any
      ): any;
      table: any[];
      defaultActions: any;
      parseError(str: string, hash: any): void;
      parse(input: string): any;
  
      lexer: Lexer;
    }
  
    const parser: Parser;
    export default parser;
  }
  