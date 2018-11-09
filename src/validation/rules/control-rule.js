/**
 * Module contains implementation of DeltaJS control validation rule
 *
 * @module control-validation-rule
 */
import {BaseRule} from "./base-rule";

/**
 * Class represents validation rule for DeltaJS control
 */
export class ControlRule extends BaseRule {
    /**
     * Creates instance of rule
     *
     * @param {HTMLElement} element Form element
     * @param {DeltaControlLoader} loader
     */
    constructor(element, loader) {
        super(element);
        this._control = loader.getControl(element);
    }

    /**
     * Used to determine if current rule should be applied to target element
     *
     * @param {HTMLElement} element Form element
     * @param {DeltaControlLoader} loader
     * @return {boolean} True if applied
     */
    static isMatch(element, loader) {
        let ctrl = loader.getControl(element);
        return !!ctrl && "validate" in ctrl;
    }

    /**
     * Getter for rule identifier used in form validation lifecycle
     */
    static get indexName() {
        return "control";
    }

    /**
     *
     * @param {*} value Value to validate
     * @return {boolean|Promise<boolean>} Result of validation
     */
    check(value) {
        return this._control.validate(value);
    }
}
