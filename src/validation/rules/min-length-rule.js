import {RequiredRule} from "./required-rule";

const MIN_LENGTH_ATTR_NAME = "minlength";
export class MinimumLengthRule extends RequiredRule {
    static get indexName() {
        return MIN_LENGTH_ATTR_NAME;
    }
    static isMatch(element) {
        return element.hasAttribute(MIN_LENGTH_ATTR_NAME);
    }
    check(value) {
        return super.check(value) && (this.limit <= value.trim().length);
    }
    get limit() {
        return parseInt(this.options.limit);
    }
    get messageParameters() {
        return this.limit;
    }
}
