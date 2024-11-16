# Polyfunc.js
 A library to create polymorphic functions without the headache of TypeScript unions

You will NEVER have to deal with a mess like this again:
```typescript
function a(b: number);
function a(b: string);
function a(b: boolean, c: number);
function a(b: SomeClass, c: string, d: boolean);
function a(b: number | string | boolean | SomeClass, c?: number | string, d?: boolean): string {
    if (c == undefined && d == undefined) {
        if (typeof b == "number") return "first thing";
        if (typeof b == "string") return "second thing";
    }
    else if (d == undefined) {
        if (typeof b == "boolean" && typeof c == "number") return "third thing";
    }
    else if (b instanceof SomeClass && typeof c == "string" && typeof d == "boolean") return "fourth thing";

    throw new Error("Invalid arguments given.");
}
```

That is _disgusting_. This is *absolutely* not readable. We need a new solution.
Enter polyfunc.js. Here's how you would handle that with the library:

```typescript
import Poly from "polyfunc";

function a(b: number);
function a(b: string);
function a(b: boolean, c: number);
function a(b: SomeClass, c: string, d: boolean);
function a(b: number | string | boolean | SomeClass, c?: number | string, d?: boolean): string {
    return Poly.match<string>('number').set(() => "first thing")
        .match('string').set(() => "second thing")
        .match('boolean', 'number').set(() => "third thing")
        .match(SomeClass, 'string', 'boolean').set(() => "fourth thing")
        .fallback(() => throw new Exception("Invalid arguments given"))
        .evaluate(...arguments);
}
```

Yeah, WAY cleaner. Sadly, you still have to do that weird union thing for the function parameters - no matter how
clean Polyfunc.js is, it can't change the TypeScript type rules. But, no more of that weird control logic
to achieve even *basic* polymorphism!

And, that's pretty much it. If it wasn't clear from usage, or you need a list of full type validation capabilities,
you can see how to use this library in `documentation.md`.

## Install
`npm install polyfunc`