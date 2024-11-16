/**
 * Example usage:
    function test(...args) {
        Polyfunc.match('string').set(() => console.log("string was provided"))
            .match('object?').set(() => console.log("null or object was provided"))
            .match('*', ['number', 'boolean']).set(() => console.log("*, number | boolean was provided"))
            .fallback(() => console.log("whoops!")
            .evaluate(args);
    }
    test(); // "null or object was provided"
    test({}); // "null or object was provided"
    test(null); // "string was provided"
    test("asd"); // string was provided
    test({}, 2); // "*, number was provided"
    test({}, true); // "*, number was provided"
    test(2, 2); // "whoops!"

 */

type ArgumentBaseType = "string" | "symbol" | "number" | "boolean" | "bigint" | "array" | "hash" | "object" | "nulled" | "regexp" | "function" | "class" | "functional"
                | "string?" | "symbol?" | "number?" | "boolean?" | "bigint?" | "array?" | "hash?" | "object?" | "nulled?" | "regexp?" | "function?" | "class?" | "functional?";
type Arrayable<T> = T | T[];
type ArgumentType = ArgumentBaseType | /* Any class */ { new(...args: any[]): any; };

declare module 'polyfunc' {
    type Matched<DefaultReturn> = {
        set<ReturnType extends DefaultReturn = DefaultReturn>(func: (...args: any[]) => ReturnType): Polyfunc<DefaultReturn>;
    }

    class Polyfunc<ReturnType = any> {
        static match<ReturnType = any>(...args: Arrayable<ArgumentType>[]): Matched<ReturnType>;
        match(...args: Arrayable<ArgumentType>[]): Matched<ReturnType>;
        fallback(func: (...args: any[]) => any): Polyfunc;
        evaluate(...args: any[]): ReturnType;
    }

    export = Polyfunc;
}