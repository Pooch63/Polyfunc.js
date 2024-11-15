/**
 * Example usage:
    function test(...args) {
        Polytech.match('string').set(() => console.log("string was provided"))
            .match('null').set(() => console.log("null was provided"))
            .match('*', ['number', 'boolean']).set(() => console.log("*, number | boolean was provided"))
            .fallback(() => console.log("whoops!")
            .evaluate(args);
    }
    test(); // "null was provided"
    test(null); // "string was provided"
    test("asd"); // string was provided
    test({}, 2); // "*, number was provided"
    test({}, true); // "*, number was provided"
    test(2, 2); // "whoops!"

 */

type Primitive = "string" | "number" | "boolean" | "bigint" | "array" | "hash" | "object" | "nulled" | "regexp" | "function" | "class" | "functional"
                | "string?" | "number?" | "boolean?" | "bigint?" | "array?" | "hash?" | "object?" | "nulled?" | "regexp?" | "function?" | "class?" | "functional?";
type Arrayable<T> = T | T[];
type ArgumentMatch = Primitive | /* Wildcard */ "*" | class | ((arg: any) => boolean);

type Matched = {
    set(func: (...args: any[]) => any): Polytech;
}

class Polytech {
    match(...args: Arrayable<ArgumentMatch>[]): Matched;
    fallback(func: (...args: any[]) => any): Polytech;
    evaluate(...args: any[]): void;
}