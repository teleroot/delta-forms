import {BaseRule} from "./base-rule";

let integerRe = /^[-+]?\d*$/;
export class IntegerRule extends BaseRule {
    static get indexName() {
        return "integer";
    }
    getInfo(value) {
        if (!value) {
            return {};
        }
        value = value.split(" ").join("");
        if (!integerRe.test(value)) {
            return [false];
        }
        const v = parseInt(value);
        if ((v + "").length > value.length) {
            return [false];
        }
        return [!isNaN(v), v];
    }
    check(value, element) {
        const inf = this.getInfo(value);
        return inf[0];
    }
}
