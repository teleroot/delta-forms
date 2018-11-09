import {PatternRule} from "./pattern-rule";

let emailRe = /^([a-z0-9_.\-+]+)@([\da-z.-]+)\.([a-z.]{2,6})$/i;
export class EmailRule extends PatternRule {
    static get indexName() {
        return "email";
    }

    get regex() {
        return emailRe;
    }
}
