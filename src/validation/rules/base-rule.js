/**
 * Module contains implementation of base class for all form validation rules
 *
 * @module base-rule
 */
import {VALIDATION_OPTION_PREFIX} from "../consts";
import {extractElementOptions} from "delta-lib";

/**
 * Abstract class represents form validation rule
 */
export class BaseRule {
    /**
     * Used to determine if current rule should be applied to target element
     *
     * @param {HTMLElement} element Form element
     * @return {boolean} True if applied
     */
    static isMatch(element) {
        return false;
    }

    /**
     * Abstract getter for rule identifier used in form validation lifecycle
     */
    static get indexName() {
        throw "Validation rule name is not specified";
    }

    /**
     * Creates instance of validation rule
     *
     * @param {HTMLElement} element Validated form element
     */
    constructor(element) {
        this.element = element;
        this._options = undefined;
    }

    /**
     * Prepares rule options based on elemnt attributes.
     * Use "data-validation-[rule id]-[name of option]" format of attribute name
     *
     * @return {Object} Rule options
     */
    readOptions() {
        return extractElementOptions(this.element,
            VALIDATION_OPTION_PREFIX + "-" + this.constructor.indexName + "-");
    }

    /**
     * Getter for rule options
     *
     * @return {*}
     */
    get options() {
        if (!this._options) {
            this._options = this.readOptions();
        }
        return this._options;
    }

    /**
     * Checks form element value
     *
     * @param {*} value Element value
     * @return {boolean} Determines if value is valid
     */
    check(value) {
        return false;
    }

    /**
     * Determines whether this rule should be used during validation after changing the value of target element.
     *
     * @return {boolean}
     */
    get allowTrigger() {
        return true;
    }

    /**
     * Parameters of message formatting
     *
     * @return {undefined}
     */
    get messageParameters() {
        return undefined;
    }
}


