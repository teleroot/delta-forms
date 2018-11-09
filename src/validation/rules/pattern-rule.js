import {BaseRule} from "./base-rule";

export class PatternRule extends BaseRule {
    static get indexName() {
        return "pattern";
    }
    get regex() {
        const pattern = this.options.pattern;
        const flags = this.options.patternFlags;
        return pattern ? new RegExp("^" + pattern + "$", flags) : null;
    }
    check(value) {
        if (!value) {
            return undefined;
        }
        value = this.prepareValue(value);
        let re = this.regex();
        return !re || re.test(value);
    }
}
