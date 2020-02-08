import { isAlphaNumericUnderscore, isAlphaUnderscore, isNumber } from './utils';

export const enum TokenType {
    OP_EQUALS = 'T_OP_EQUALS',
    OP_BRACE_LEFT = 'T_OP_BRACE_LEFT',
    OP_BRACE_RIGHT = 'T_OP_BRACE_RIGHT',
    IDENTIFIER = 'T_IDENTIFIER',
    NUMBER = 'T_NUMBER',
    STRING = 'T_STRING'
}

export class Token {

    constructor(
        public readonly val: string,
        public readonly type: TokenType,
        public readonly line?: number
    ) {}

}

export class UnexpectedCharacter extends Error {

    /**
     * @param char The character that was unexpected.
     * @param line The line on which the character was found.
     */
    constructor(char: string, line: number) {
        super(`Unexpected ${char} at line ${line}`);
    }

}

export class Lexer {

    /** The index of the character that we are currently processing. */
    protected index = -1;

    /** The line which is currently processed. */
    protected line = 0;

    /**
     * @param input The input string on which this parser operates.
     */
    constructor(protected readonly input: string) {}

    /** Returns the next character in `input`. Does not consume the character. */
    public peek(): string | undefined {
        return this.input[ this.index + 1];
    }

    /** Returns the current character in `input`. Does not consume the character. */
    public curr(): string | undefined {
        return this.input[ this.index ];
    }

    /** Advances the lexer and returns the next character. */
    public next(): string | undefined {
        return this.input[ ++this.index ];
    }

    /** Returns `true` if we are at the end of {@link input}. */
    public isEnd(): boolean {
        return this.index >= this.input.length - 1;
    }

    /**
     * Advances the lexer until the given `test` function returns `false` and returns a
     * lexeme from all visited characters.
     */
    protected collect(test: (val: any) => boolean): string {
        let lexeme = this.curr();
        let curr;

        if (!lexeme) {
            throw new Error('Unexpected error.');
        }

        // noinspection JSAssignmentUsedAsCondition
        while(curr = this.next()) {
            if (test(curr)) {
                lexeme += curr;
            }
            else {
                break;
            }
        }

        return lexeme;
    }

    /** Builds a `TokenType.STRING` token and returns it. */
    protected string(): Token {
        let lexeme = '';
        let next;

        // noinspection JSAssignmentUsedAsCondition
        while(next = this.peek()) {
            // Prevent multiline strings.
            // Todo: Check if this is correct with the specification.
            if (next === '\n') {
                throw new Error('Illegal line-break');
            }

            // Terminate string.
            if (next === '"') {
                break;
            }

            lexeme += this.next();
        }

        if (this.isEnd()) {
            throw new Error("Unterminated String");
        }

        // Skip the closing "
        this.next();

        return this.createToken(lexeme, TokenType.STRING);
    }

    /** Builds a `TokenType.IDENTIFIER` token and returns it. */
    protected identifier(): Token {
        // While variables can't start with a number they can contain it.
        return this.createToken(
            this.collect(isAlphaNumericUnderscore), TokenType.IDENTIFIER
        );
    }

    /** Creates a token. */
    protected createToken(val: string, type: TokenType): Token {
        return new Token(val, type, this.line);
    }

    /** Returns an iterator that will yield all tokens found in {@see input}. */
    public *tokenize(): IterableIterator<Token> {
        let char;

        // noinspection JSAssignmentUsedAsCondition
        while (char = this.next()) {
            switch (char) {
                // Skip whitespaces.
                case ' ':
                case '\r':
                case '\t':
                    continue;
                case '\n':
                    this.line++;
                    break;
                case '{':
                    yield this.createToken(char, TokenType.OP_BRACE_LEFT);
                    break;
                case '}':
                    yield this.createToken(char, TokenType.OP_BRACE_RIGHT);
                    break;
                case '=':
                    yield this.createToken(char, TokenType.OP_EQUALS);
                    break;
                case '#':
                    // Ignore comments.
                    while (this.peek() !== '\n') {
                        this.next();
                    }
                    break;
                case '"':
                    yield this.string();
                    break;
                default:
                    // Identifiers can start with alpha letters or "_".
                    if (isAlphaUnderscore(char)) {
                        yield this.identifier();
                    }
                    // Numbers, floats etc.
                    else if (isNumber(char)) {
                        yield this.createToken(this.collect(isNumber), TokenType.NUMBER);
                    }
                    else {
                        throw new UnexpectedCharacter(char, this.line);
                    }
            }
        }
    }

}
