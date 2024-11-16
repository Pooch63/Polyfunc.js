const PACKAGE_NAME = "Polyfunctional";

function isClass(obj) {
    return typeof obj === "function" && /^class\s/.test(obj.toString());
}
function isExclusiveFunction(obj) {
    return typeof obj === "function" && !isClass(obj);
}
function isRegexp(obj) {
    return obj instanceof RegExp;
}

/**
 * @param {string} rule 
 * @param {*} arg 
 * @return {boolean}
 */
function validateArg(rule, arg) {
    // If it's a class or function, then return whether or not the argument is an instance of the class or function
    if (typeof rule === "function") return arg instanceof rule;

    let lastCharacter = rule.charAt(rule.length - 1);
    let nullable = lastCharacter == "?";
    let unquestioned = nullable ? rule.slice(0, rule.length - 1) : rule;

    if (nullable && (arg === null || arg === undefined)) return true;

    switch (unquestioned) {
        case "number":
        case "string":
        case "symbol":
        case "boolean":
        case "bigint":
            return typeof arg === unquestioned;
        case "array":
            return Array.isArray(arg);
        case "hash":
            return typeof arg === "object" && !Array.isArray(arg) && !isRegexp(arg) && arg !== null;
        case "object":
            return typeof arg === "object" && !isRegexp(arg) && arg !== null;
        case "nulled":
            return arg === null || arg === undefined;
        case "regexp":
            return isRegexp(arg);
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
    if (schema.length < args.length) {
        // If everything is just null, we can remove it
        while (args.length > 0 && args[args.length - 1] == undefined) args.pop();
        // if there are STILL more arguments that the schema specified, then we return
        if (schema.length < args.length) return false;
    }

    for (let ind = 0; ind < schema.length; ind++) {
        const arg = args[ind];
        const rule = schema[ind];
        // If it's an array, only one rule has to match
        if (Array.isArray(rule)) {
            for (let miniRule of rule) {console.log("RULE: " + miniRule);if (validateArg(miniRule, arg)) return true;}
            return false;
        }
        if (!validateArg(rule, arg)) return false;
    }
    return true;
}

class Match {
    /**
     * 
     * @param {Polyfunc} validator 
     * @param {any[]} schema
     */
    constructor(validator, schema) {
        this.validator = validator;
        this.schema = schema;
        // Will eventually become a function
        // Is called with the arguments that get evaulated
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
    run(...args) {
        return this.func(...args);
    }
    /**
     * @param {...any[]} args
     * @return {boolean}
     */
    test(...args) {
        return validate(this.schema, args);
    }
}
class Polyfunc {
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
   static match(...args) {
        let wrapper = new Polyfunc();
        return wrapper.match(...args);
    };
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
                return match.run(...args);
            }
        }

        if (this.fallback_function != null) return this.fallback_function();
    };
}

module.exports = Polyfunc;