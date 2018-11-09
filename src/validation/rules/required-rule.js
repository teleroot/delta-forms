import {BaseRule} from "./base-rule";

function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
export class RequiredRule extends BaseRule {
    static isMatch(element) {
        return element.hasAttribute("required");
    }
    static get indexName() {
        return "required";
    }
    check(value) {
        if (value === undefined || value === null) {
            return false;
        }
        if (value instanceof Date) {
            return true;
        }
        if (typeof(value) === "number") {
            return !isNaN(value);
        }
        if (typeof (value) === "string") {
            return !!value.trim();
        }
        if ("length" in value && value.length) {
            return true;
        }
        return !isEmpty(value);
    }
}
