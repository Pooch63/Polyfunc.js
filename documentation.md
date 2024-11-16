Methods covered in this file: `.match`, `.set`, `.fallback`, and `.evaluate`.

Polyfunc.js aims to be a clean library. Do `Poly.match(` followed by a type schema. Call `.set` on that
in order to specify the callback function if the type schema was matched. The function you pass to set
will be passed the arguments, and whatever it returns will ultimately be what the whole chain returns.
E.g.,
```typescript
Poly.match('number').set((a) => a * 2).evaluate(5); // returns 10
```

After specifying all your callbacks, run `.evaluate()` with all of your arguments

So, e.g.,
```javascript
function test(a, b, c) {
    Poly.match('*').set(() => console.log("one argument"))
        .match('*', 'number').set(() => console.log("anything followed by number"))
        .match('*', '*', '*').set(() => console.log("three arguments"))
        .evaluate(a, b, c);
}
test({}); // "one argument"
test(null, 2); // "anything followed by number"
test([], "", 3); // "three arguments"
```

Know that once a pattern is matched, the whole chain terminates. So,
```javascript
let matcher = Poly.match('number').set(() => console.log("number"))
    .match('*').set(() => console.log("anything else"));

matcher.evaluate(0); // "number"
matcher.evaluate(""); // "anything else"
```

Also, Polyfunc does have type safety for TypeScript users. If using TypeScript, you MUST
specify the chain's return type on the first call. Here's the first example written in TypeScript.
Note: It could be made safer by adding a fallback function.
```typescript
let matcher = Poly.match<string>('number').set(() => "number")
    .match('*').set(() => "anything else");

console.log(matcher.evaluate(0)); // "number"
console.log(matcher.evaluate("")); // "anything else
```


Now, here are the types you can match:

```typescript
"string" | "symbol" | "number" | "boolean" | "bigint" | "array" | "hash" | "object" | "nulled" | "regexp" | "function" | "class" | "functional" | "*"
```
The wildcard '*' matches literally everything.

Here are some differences:
- Objects
    - `array` only matches arrays. So, `[]` is accepted, but `{}` is not.
    - `hash` only matches hashmaps (also called dictionaries). So, `[]` is NOT accepted, but `{}` is.
    - `object` matches both. So, `{}` AND `[]` are accepted.
    - Note that even though `typeof /some_regexp/` and `typeof null` are both "object", they will never be accepted by `array`, `hash`, or `object`.
- Functions
    - `function` matches functions and NOT classes.
    - `class` matches classes and NOT functions.
    - `functional` matches both functions AND classes.

Add a question mark to any type to say that it is allowed to be nullable. E.g., `.match("number").set(...).evaluate()` will not call the function, but
`.match("number?").set(...).evaluate()` will.

Add multiple types to an array in order to match at least one of them to a value. E.g.,
`.match(["number", "string"]).set(...).evaluate(1)` calls the same function as if you had said `..evaluate("some string")`

You can also pass in your own class or function, and Polyfunc will check whether or not a value is an instance of that class or function.
E.g.,
```typescript
class MyClass {}

Poly.match(MyClass).set(() => "Custom class given").evaluate(new MyClass()); // returns "Custom class given"
```

And, you can obviously use this in an array of multiple types. E.g.,
```typescript
class MyClass {}

let matcher = Poly.match([MyClass, 'number']).set(() => "Class or number given");
matcher.evaluate(new MyClass()); // returns "Class or number given"
matcher.evaluate(4); // returns "Class or number given"
```

Lastly, you can use `.fallback` to specify a default function if no patterns matched. E.g.,
```typescript
let matcher = Poly.match('string').set(() => "some string")
    .fallback((a) => a * 2);

matcher.evaluate(""); // Returns "some string"
matcher.evaluate(5); // Returns 10 because a string wasn't matched, so the fallback was used
```

Here's a slightly more complex example of `.fallback` using multiple patterns. Remember: the `.fallback` function
is only called if NO patterns were matched.
```typescript
let matcher = Poly.match('string').set(() => "some string")
    .match('number', 'hash').set(() => "dictionary given")
    .fallback((a) => a * 2);

matcher.evaluate(""); // Returns "some string"
matcher.evaluate({}); // Returns "dictionary given"
matcher.evaluate(5); // Returns 10 because a string wasn't matched, so the fallback was used
```