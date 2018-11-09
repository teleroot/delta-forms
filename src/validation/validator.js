import {messages} from "../i18n/default";
import {DOMElementAccessor} from "../utilities/accessors";
import {VALIDATION_OPTION_PREFIX} from "./consts";
import {ControlRule} from "./rules/control-rule";
import {RequiredRule} from "./rules/required-rule";

const constraintMap = new WeakMap();

export class FormValidator {
    constructor(elementMap, loader) {
        this.elementReader = new DOMElementAccessor(loader);
        this.elementMap = elementMap;
    }
    updateOptions() {
        const constraints = this.constraints
            .map((v)=>this.formatRuleClass(v));
        Object.keys(this.elementMap).forEach((p)=>{
            let element = this.elementMap[p];
            let elc = this.createElementConstraints(constraints, element);
            this.attachToElement(p, elc);
        });
    }
    formatRuleClass(item) {
        if (!(item instanceof Array)) {
            item = [item];
        }
        return [item[0], item.slice(1)];
    }
    createElementConstraints(constraints, element) {
        let explicitRuleNames = element.getAttribute(VALIDATION_OPTION_PREFIX + "-rules");
        let exRules = explicitRuleNames ? explicitRuleNames.split(" "): [];

        constraints = constraints.filter((v)=>{
            const item = v[0];
            return exRules.indexOf(item.indexName) !== -1 ||
                (item.isMatch && item.isMatch(element, ...v[1]));
        });

        return constraints.map((item) => {
            return new (Function.prototype.bind.call(item[0], null, element, ...item[1]));
        });
    }
    get constraints() {
        return [
            [ControlRule, this.elementReader.loader],
            RequiredRule
        ];
    }
    get isValidateOnChange() {
        return true;
    }
    getAutoValidationEvent(element) {
        return "change";
    }
    getElement(memberName) {
        return this.elementMap[memberName];
    }
    bindAutoValidation(memberName) {
        let element = this.getElement(memberName);
        element.addEventListener(this.getAutoValidationEvent(element), (e)=> {
            this.clearElementError(memberName);
            this.validate(memberName, true);
        });
    }
    attachToElement(memberName, constraints) {
        let res = this.setElementConstraints(this.getElement(memberName), constraints);
        if (!res) {
            return res;
        }

        if (!this.isValidateOnChange) {
            return res;
        }
        this.bindAutoValidation(memberName);

        return res;
    }
    writeError(element, message) {}
    removeError(element) {}
    showError(inputName, errorMessage) {
        let element = this.elementMap[inputName];
        this.writeError(element, errorMessage);
    }
    clearElementError(inputName) {
        let element = this.elementMap[inputName];
        this.removeError(element);
    }
    clear(inputNames) {
        inputNames = inputNames || Object.keys(this.elementMap);
        inputNames.forEach((name) => {
            this.clearElementError(name);
        });
    }
    formatResult(result) {
        return result;
    }
    getElementConstraints(element) {
        return constraintMap.get(element);
    }
    setElementConstraints(element, constraints) {
        if (!constraints || !constraints.length) {
            return false;
        }
        constraintMap.set(element, constraints);
        return true;
    }
    validate(inputName, triggered) {
        let element = this.getElement(inputName);
        let inputConstraints = this.getElementConstraints(element);
        if (!inputConstraints) {
            return true;
        }

        if (triggered) {
            inputConstraints = inputConstraints.filter((item)=>{
                return item.allowTrigger;
            });
        }
        if (!inputConstraints || !inputConstraints.length) {
            return true;
        }

        return this.validateConstraints(inputName, inputConstraints);
    }
    async validateInputs(inputNames) {
        this.clear(inputNames);
        const promises = inputNames.map((v)=>this.validate(v, false));
        const res = await Promise.all(promises);
        if (!res) {
            return res;
        }
        return res.indexOf(false) === -1;
    }
    getInputValue(input) {
        return this.elementReader.getValue(input);
    }
    getMessages() {
        return messages;
    }
    get fallbackErrorMessage() {
        return undefined;
    }
    getErrorMessage(inputName, constraint) {
        let constraintName = constraint.constructor.indexName;
        let message = constraint.options.message;
        if (!message) {
            message = this.getMessages()[constraintName];
        }
        if (!message) {
            message = this.fallbackErrorMessage;
        }
        if (!message) {
            throw `Validation message not found. Constraints: ${constraintName}. Input: ${inputName}`;
        }
        return (message.constructor === String) ? message : message(constraint.messageParameters);
    }
    async validateConstraints(inputName, constraints) {
        let result;


        let i = 0;


        let element = this.elementMap[inputName];


        let value = this.getInputValue(element);
        for (; i < constraints.length; i++) {
            const item = constraints[i];
            result = await item.check(value);
            result = result!==false;
            if (!result) {
                this.showError(inputName, this.getErrorMessage(inputName, item));
                return false;
            }
        }
        return true;
    }
}
