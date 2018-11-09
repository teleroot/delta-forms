import {ControlRule} from "./control-rule";
import {RequiredRule} from "./required-rule";
import {PatternRule} from "./pattern-rule";
import {IntegerRule} from "./integer-rule";
import {MinimumLengthRule} from "./min-length-rule";
import {EmailRule} from "./email-rule";

export function allRules(loader) {
    return [
        [ControlRule, loader],
        RequiredRule,
        PatternRule,
        EmailRule,
        IntegerRule,
        MinimumLengthRule
    ];
}
