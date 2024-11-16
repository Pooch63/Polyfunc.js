const { describe, test, expect } = require("@jest/globals");
const Polyfunc = require("../polyfunc.js");

describe("Normal types work", () => {
    test("Number", () => {
        expect(
            Polyfunc.
            match('number').set(() => "number!").
            evaluate(1)
        ).toBe("number!");
    });
    test("String", () => {
        expect(
            Polyfunc.
            match('string').set(() => "string!").
            evaluate("hey")
        ).toBe("string!");
    });
    test("Boolean", () => {
        expect(
            Polyfunc.
            match('boolean').set(() => "boolean!").
            evaluate(true)
        ).toBe("boolean!");
    });
    test("Bigint", () => {
        expect(
            Polyfunc.
            match('bigint').set(() => "bigint!").
            evaluate(1n)
        ).toBe("bigint!");
    });
    test("Array", () => {
        expect(
            Polyfunc.
            match('array').set(() => "array!").
            evaluate([])
        ).toBe("array!");
        expect(
            Polyfunc.
            match('array').set(() => "array!").
            fallback(() => "nothing").
            evaluate({})
        ).toBe("nothing");

        // Since typeof regexp is "object", make sure regexp does NOT trigger the array
        expect(
            Polyfunc.
            match('array').set(() => "array!").
            fallback(() => "nothing").
            evaluate(/regexp/)
        ).toBe("nothing");
    });
    test("Hash", () => {
        expect(
            Polyfunc.
            match('hash').set(() => "hash!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("nothing");
        expect(
            Polyfunc.
            match('hash').set(() => "hash!").
            evaluate({})
        ).toBe("hash!");

        // Since typeof regexp is "object", make sure regexp does NOT trigger the hash
        expect(
            Polyfunc.
            match('hash').set(() => "hash!").
            fallback(() => "nothing").
            evaluate(/regexp/)
        ).toBe("nothing");
    });
    test("Object", () => {
        expect(
            Polyfunc.
            match('object').set(() => "object!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("object!");
        expect(
            Polyfunc.
            match('object').set(() => "object!").
            evaluate({})
        ).toBe("object!");

        // Since typeof regexp is "object", make sure regexp does NOT trigger the object
        expect(
            Polyfunc.
            match('object').set(() => "object!").
            fallback(() => "nothing").
            evaluate(/regexp/)
        ).toBe("nothing");
    });
    test("Nulled", () => {
        expect(
            Polyfunc.
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nulled!");
        expect(
            Polyfunc.
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nulled!");
        expect(
            Polyfunc.
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate(undefined)
        ).toBe("nulled!");

        // Make sure values that are randomly null in JS are not seen as null
        expect(
            Polyfunc.
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate(0)
        ).toBe("nothing");
        expect(
            Polyfunc.
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate("")
        ).toBe("nothing");
        expect(
            Polyfunc.
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("nothing");
        expect(
            Polyfunc.
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate({})
        ).toBe("nothing");
    });
    test("Regular expressions", () => {
        expect(
            Polyfunc.
            match('regexp').set(() => "regexp!").
            evaluate(/regexp/)
        ).toBe("regexp!");

        // Since typeof regexp is "object", make sure objects do NOT trigger the regexp
        expect(
            Polyfunc.
            match('regexp').set(() => "regexp!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("nothing");
        expect(
            Polyfunc.
            match('regexp').set(() => "regexp!").
            fallback(() => "nothing").
            evaluate({})
        ).toBe("nothing");
    });
    test("Functions", () => {
        expect(
            Polyfunc.
            match('function').set(() => "function!").
            evaluate(() => {})
        ).toBe("function!");
        expect(
            Polyfunc.
            match('function').set(() => "function!").
            evaluate(new Function("function k() { return 1; }"))
        ).toBe("function!");

        // Since typeof (class CLASS) is also "function", make sure classes don't trigger
        class K {}
        expect(
            Polyfunc.
            match('function').set(() => "function!").
            fallback(() => "nothing").
            evaluate(K)
        ).toBe("nothing");
    });
    test("Value is a class", () => {
        class K {}
        expect(
            Polyfunc.
            match('class').set(() => "class!").
            fallback(() => "nothing").
            evaluate(K)
        ).toBe("class!");

        // Since the typeof function is the same as typeof class is the same as "function",
        // make sure callable functions don't trigger
        expect(
            Polyfunc.
            match('class').set(() => "class!").
            fallback(() => "nothing").
            evaluate(() => {})
        ).toBe("nothing");
        expect(
            Polyfunc.
            match('class').set(() => "class!").
            fallback(() => "nothing").
            evaluate(new Function("function k() { this.z = 9; return 1; }"))
        ).toBe("nothing");
    });
    test("Functional", () => {
        class K {}
        expect(
            Polyfunc.
            match('functional').set(() => "functional!").
            fallback(() => "nothing").
            evaluate(K)
        ).toBe("functional!");
        
        expect(
            Polyfunc.
            match('functional').set(() => "functional!").
            fallback(() => "nothing").
            evaluate(() => {})
        ).toBe("functional!");
        expect(
            Polyfunc.
            match('functional').set(() => "functional!").
            fallback(() => "nothing").
            evaluate(new Function("function k() { this.z = 9; return 1; }"))
        ).toBe("functional!");
    });

    test("Arguments instanceof classes", () => {
        class k {};
        expect(
            new Polyfunc().
            match(k).set(() => "class!").
            evaluate(new k())
        ).toBe("class!");
    })
});

describe("Non-nullable types don't validate null", () => {
    test("Strings", () => {
        expect(
            new Polyfunc().
            match("string").set(() => "string!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("string").set(() => "string :)").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    });

    test("Object", () => {
        expect(
            new Polyfunc().
            match("object").set(() => "object!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("object").set(() => "object!").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    });

    test("Regexp", () => {
        expect(
            new Polyfunc().
            match("regexp").set(() => "regexp!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("regexp").set(() => "regexp!").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    })

    test("Class", () => {
        expect(
            new Polyfunc().
            match("class").set(() => "class!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("class").set(() => "class? :)").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    });
});

describe("Nullable types work", () => {
    test("Strings", () => {
        expect(
            new Polyfunc().
            match("string?").set(() => "string? :)").
            evaluate("string")
        ).toBe("string? :)");
        expect(
            new Polyfunc().
            match("string?").set(() => "string? :)").
            evaluate(null)
        ).toBe("string? :)");
    });

    test("Array", () => {
        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate()
        ).toBe("array? :)");
        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate(null)
        ).toBe("array? :)");

        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate([])
        ).toBe("array? :)");
        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate(["this is an element that is not null"])
        ).toBe("array? :)");
    });
    test("Hash", () => {
        expect(
            new Polyfunc().
            match("hash?").set(() => "hash? :)").
            evaluate()
        ).toBe("hash? :)");
        expect(
            new Polyfunc().
            match("hash?").set(() => "hash? :)").
            evaluate(null)
        ).toBe("hash? :)");
    });
    test("Object", () => {
        expect(
            new Polyfunc().
            match("object?").set(() => "object? :)").
            evaluate()
        ).toBe("object? :)");
        expect(
            new Polyfunc().
            match("object?").set(() => "object? :)").
            evaluate(null)
        ).toBe("object? :)");
    });

    test("Regexp", () => {
        expect(
            new Polyfunc().
            match("regexp?").set(() => "regexp? :)").
            evaluate(/regexp/)
        ).toBe("regexp? :)");
        expect(
            new Polyfunc().
            match("regexp?").set(() => "regexp? :)").
            evaluate(null)
        ).toBe("regexp? :)");
    });

    test("Class", () => {
        expect(
            new Polyfunc().
            match("class?").set(() => "class? :)").
            evaluate()
        ).toBe("class? :)");
        expect(
            new Polyfunc().
            match("class?").set(() => "class? :)").
            evaluate(null)
        ).toBe("class? :)");
    });
});

describe("Multiple rules work", () => {
    class Custom {};
    test("Primitives and nulls", () => {
        expect(
            new Polyfunc().
            match(["string", "nulled"]).set(() => "string | null").
            evaluate("string")
        ).toBe("string | null");
        expect(
            new Polyfunc().
            match(["string", "nulled"]).set(() => "string | null").
            evaluate(null)
        ).toBe("string | null");
        expect(
            new Polyfunc().
            match(["symbol", "nulled"]).set(() => "symbol | null").
            evaluate(Symbol(""))
        ).toBe("symbol | null");
    });
    test("Different types", () => {
        expect(
            new Polyfunc().
            match([Custom, "string"]).set(() => "custom | string").
            evaluate(new Custom())
        ).toBe("custom | string");
        expect(
            new Polyfunc().
            match([Custom, "string"]).set(() => "custom | string").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    });
    test("Nullable types mixed", () => {
        expect(
            new Polyfunc().
            match([Custom, "string?"]).set(() => "custom | string?").
            evaluate(null)
        ).toBe("custom | string?");
    });
});

describe("Argument passing works", () => {
    test("3 arguments", () => {
        expect(
            Polyfunc.match('number', 'number', 'number')
                .set((a, b, c) => a * b - c)
                .evaluate(1, 2, 3)
        ).toBe(-1);
    });
    test("Multiple argument counts", () => {
        function poly(a, b, c) {
            return Polyfunc.match('number').set((a) => a * a * a)
                .match('number', 'number').set((a, b) => a * a * b)
                .match('number', 'number', 'number').set((a, b, c) => a * b * c)
                .evaluate(a, b, c);
        }
        expect(poly(3)).toBe(27);
        expect(poly(3, 4)).toBe(36);
        expect(poly(3, 4, 5)).toBe(60);
    })
});