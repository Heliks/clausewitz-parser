import { Context } from './context';
import { Lexer, Token, TokenType } from './lexer';
import { Struct } from './types';

class UnexpectedToken extends Error {

    /**
     * @param token The token that was not expected.
     */
    constructor(token: Token) {
        super(`Unexpected ${token.type} at line ${token.line}: ${token.val}`);
    }

}

/**
 * Parses an identifier and converts it if necessary.
 * Todo: This function is a workaround as long as the lexer does not support keywords.
 */
function parseIdentifier(val: string): any {
    switch (val.toLowerCase()) {
        case 'yes':
            return true;
        case 'no':
            return false;
        default:
            return val;
    }
}

/**
 * Parses the given string in Clausewitz format and converts it to JSON.
 *
 * ```ts
 * const data = parse(`
 *    foo = "Hello",
 *    bar = "World"
 * `);
 *
 * console.log(data.foo); // Logs "Hello"
 * console.log(data.bar); // Logs "World"h
 * ```
 *
 * Re-occurring keys will be merged into an array.
 *
 * ```ts
 * const data = parse(`arr = Hello arr = World arr = 3`);
 *
 * console.log(data.arr[0]); // "Hello"
 * console.log(data.arr[1]); // "World"
 * console.log(data.arr[2]); // 3
 * ```
 *
 * The values "yes" and "no" will be converted to booleans:
 *
 * ```ts
 * const data = parse(`a = yes b = no`);
 *
 * console.log(data.a); // true
 * console.log(data.b); // false
 * ```
 */
export function parse(input: string): Struct {
    const iter = new Lexer(input).tokenize();
    const root = new Context();

    // The context on which we are working on currently.
    let ctx = root;

    for (const token of iter) {
        switch (token.type) {
            case TokenType.IDENTIFIER:
                const op = iter.next().value;

                if (op.type !== TokenType.OP_EQUALS) {
                    throw new UnexpectedToken(op);
                }

                const right = iter.next().value;

                switch (right.type) {
                    case TokenType.IDENTIFIER:
                        ctx.setData(token.val, parseIdentifier(right.val));
                        break;
                    case TokenType.STRING:
                        ctx.setData(token.val, right.val);
                        break;
                    case TokenType.NUMBER:
                        ctx.setData(token.val, parseFloat(
                            right.val
                        ));
                        break;
                    case TokenType.OP_BRACE_LEFT:
                        ctx = ctx.setChild(token.val);
                        break;
                    default:
                        throw new UnexpectedToken(right);
                }
                break;
            case TokenType.OP_BRACE_RIGHT:
                // If we are already at the root level we have an extra "}" dangling around.
                if (!ctx.parent) {
                    throw new UnexpectedToken(token);
                }

                ctx = ctx.parent as any;
                break;
            default:
                throw new UnexpectedToken(token);
        }
    }

    return root.data;
}
