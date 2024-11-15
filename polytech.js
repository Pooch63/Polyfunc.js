const PACKAGE_NAME = "Polytech";

function isClass(obj) {
    return typeof obj === "function" && /^class\s/.test(obj.toString());
}
function isExclusiveFunction(obj) {
    return typeof obj === "function" && !isClass(obj);
}

/**
 * @param {string} rule 
 * @param {*} arg 
 * @return {boolean}
 */
function validateArg(rule, arg) {
    // If it's a class, then return whether or not the argument is an instance of the class
    if (isClass(rule)) return arg instanceof rule;
    // If it's a function, then return whether or not the argument passes the function

    let lastCharacter = rule.charAt(rule.length - 1);
    let nullable = lastCharacter == "?";
    let unquestioned = nullable ? rule.slice(0, rule.length - 1) : rule;

    if (nullable && (arg === null || arg === undefined)) return true;

    switch (unquestioned) {
        case "number":
        case "string":
        case "boolean":
        case "bigint":
            return typeof arg === rule;
        case "array":
            return Array.isArray(arg);
        case "hash":
            return typeof x === "object" && !Array.isArray(arg) && x !== null;
        case "object":
            return typeof x === "object" && x !== null;
        case "null":
            return arg === null || arg === undefined;
        case "regexp":
            return arg instanceof RegExp;
        case "function":
            return isExclusiveFunction(arg);
        case "class":
            return isClass(arg);
        // Matches class and functions
        case "functional":
            return typeof arg === "function";

        case "*":
            return true;

        default:
            throw new Error(`Invalid ${PACKAGE_NAME} rule: ${rule}. if you expected this to work, first remove any whitespace.`);
    }
}
function validate(schema, args) {
    // Values are allowed to be nullable, so the schema is allowed to
    // be longer than the arguments, but the arguments should NEVER be longer
    // than the schema
    if (schema.length < args.length) return false;

    for (let ind = 0; ind < schema.length; ind++) {
        const arg = args[ind];
        const rule = schema[ind];
        // If it's an array, only one rule has to match
        if (Array.isArray(rule)) {
            for (let miniRule of rule) if (validateArg(miniRule, arg)) return true;
            return false;
        }
        if (!validateArg(rule, arg)) return false;
    }
    return true;
}

class Match {
    /**
     * 
     * @param {Polytech} validator 
     * @param {any[]} schema
     */
    constructor(validator, schema) {
        this.validator = validator;
        this.schema = schema;
        // Will eventually become a function
        this.func = null;
    }

    set(func) {
        if (!isExclusiveFunction(func)) {
            throw new Error(`${PACKAGE_NAME} rules may only be functions.`);
        }
        this.func = func;
        this.validator.pushTest(this);
        return this.validator;
    }
    run() {
        this.func();
    }
    /**
     * @param {...any[]} args
     * @return {boolean}
     */
    test(...args) {
        return validate(this.schema, args);
    }
}
class Polytech {
    constructor() {
        // Tests is of type Match[]
        this.tests = [];
        // Could also be the fallback function
        this.fallback_function = null;
    }

    /**
     * @param {Match} match 
     */
    pushTest(match) {
        this.tests.push(match);
    }

    /**
     * @param  {...any} args
     * @return {Match}
     */
    match(...args) {
        return new Match(this, args);
    };

    fallback(func) {
        if (!isExclusiveFunction(func)) {
            throw new Error(`${PACKAGE_NAME} fallback may only be a function.`);
        }
        this.fallback_function = func;
        return this;
    };
    evaluate(...args) {
        for (let match of this.tests) {
            if (match.test(...args)) {
                match.run();
                return;
            }
        }

        if (this.fallback_function != null) this.fallback_function();
    };
}

const Poly = new Polytech();

Poly.match('string?').set(() => console.log('matchnig string')).
    match(['regexp', 'null']).set(() => console.log('matchnig regex')).
    fallback(() => console.log("falling back")).evaluate(/9/);
