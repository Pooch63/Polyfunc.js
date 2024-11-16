# Polyfunc.js
 A library to create polymorphic functions without the headache of TypeScript unions

You will NEVER have to deal with a mess like this again:
```typescript
function a(b: number);
function a(b: string);
function a(b: boolean, c: number);
function a(b: SomeClass, c: string, d: boolean);
function a(b: number | string | boolean | SomeClass, c?: number | string, d?: boolean) {
    if (c == undefined && d == undefined) {
        if (typeof b == "number") /// One thing
        if (typeof b == "string") // Second thing
    }
    else if (d == undefined) {
        if (typeof b == "boolean" && typeof c == "number") // Third thing
    }
    else if (b instanceof SomeClass && typeof c == "string" && typeof d == "boolean") // Fourth thing
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
function a(b: number | string | boolean | SomeClass, c?: number | string, d?: boolean) {
    Poly.match('number').set(() => "first thing")
        .match('string').set(() => "second thing")
        .match('boolean', 'number').set(() => "third thing")
        .match(SomeClass, 'string', 'boolean').set(() => "fourth thing")
        .evaluate(...arguments);
}
```

Yeah, WAY cleaner. Sadly, you still have to do that weird union thing for the function parameters - no matter how
clean Polyfunc.js is, it can't change the TypeScript type rules. But, no more of that weird control logic
to achieve even *basic* polymorphism!

And, that's pretty much it. If it wasn't clear from usage, or you need a list of full type validation capabilities,
you can see how to use this library in `documentation.md`.