import {FormValidator} from "./validation/validator";
import {DOMElementAccessor} from "./utilities/accessors";
import {AttributeIndexDefinition, Control} from "delta-lib";


let bindIndexDefinition = new AttributeIndexDefinition("data-bind");

export class Form extends Control {
    /**
     * Shortcut getter for indexed form elements
     * @return {*}
     */
    get binds() {
        return this.indexes.binds;
    }

    /**
     * Names of form elements
     * @return {string[]}
     */
    get inputNames() {
        return Object.keys(this.indexes.binds);
    }

    /**
     * Returns new instance of form validator.
     * Override this method if you need a custom validator.
     *
     * @return {FormValidator}
     */
    get validatorInstance() {
        return new FormValidator(this.indexes.binds, this.loader);
    }

    /**
     * Getter for form index definitions
     *
     * @return {Object}
     */
    get indexDefinitions() {
        let res = super.indexDefinitions;
        res["binds"] = bindIndexDefinition;
        return res;
    }

    /**
     * Form value getter.
     * @return {Object} Object containing form element names as keys and corresponding values
     */
    get value() {
        return this.collectData();
    }

    /**
     * Form value setter
     *
     * @param {Object} data
     */
    set value(data) {
        this.setValue(data);
    }

    /**
     * Initialize control
     *
     * @return {Promise}
     */
    initialize() {
        this.validator = this.validatorInstance;
        this.elementAccessor = new DOMElementAccessor(this.loader);
        return super.initialize();
    }

    /**
     * Creates child controls
     *
     * @return {Promise<void>}
     */
    async createChildControls() {
        await super.createChildControls();
        this.validator.updateOptions();
    }

    /**
     * Called when validation error occurs
     * @param {Error} err
     */
    onValidationError(err) {
        throw err;
    }

    /**
     * Called when submit error occurs
     * @param {Error} err
     */
    onSubmitError(err) {
        throw err;
    }

    /**
     * Called after submit
     *
     * @param {*} sendResult Result of form submit
     * @param {*} data Submitted data
     */
    onSubmitSuccess(sendResult, data) {}

    /**
     * Override this method if you need custom implementation of form submit
     * (send data to server, notify application & etc).
     *
     * @param {*} data Form data to submit
     * @return {Promise}
     */
    async sendData(data) {}

    /**
     * Submits form
     *
     * @return {Promise<*>} Promise resolving form data
     */
    async submit() {
        let isValid = await this.checkValidity();
        if (isValid) {
            let data = this.collectData();
            try {
                let sendResult = await this.sendData(data);
                this.onSubmitSuccess(sendResult, data);
            } catch (err) {
                this.onSubmitError(err);
            }
            return data;
        }
        return undefined;
    }

    /**
     * Validates form data
     *
     * @return {boolean|Promise<boolean>} Result of checking.
     */
    async checkValidity() {
        try {
            return await this.validator.validateInputs(this.inputNames);
        } catch (e) {
            this.onValidationError(e);
            return false;
        }
    }

    /**
     * Sets value for target input
     *
     * @param {String} inputName Name of target input element
     * @param {*} value Value to set
     */
    setInputValue(inputName, value) {
        this.elementAccessor.setValue(this.binds[inputName], value);
    }

    /**
     * Overrid
     * @param {*} value
     * @return {*}
     */
    formatInputValue(value) {
        return value;
    }

    /**
     * Writes form element value to destination object
     *
     * @param {Object} destination Destination object
     * @param {String} inputName Name of form element
     */
    writeInputValue(destination, inputName) {
        let element = this.binds[inputName];
        let value = this.elementAccessor.getValue(element);
        destination[inputName] = this.formatInputValue(value);
    }

    /**
     * Sets values of form elements
     *
     * @param {Object} data Object containing form element names as keys and corresponding values
     * @param {string[]} inputNames Names of target form elements
     */
    setValue(data, inputNames) {
        if (!data) {
            return;
        }
        inputNames = inputNames || this.inputNames;
        inputNames.forEach((name)=>{
            if (name in data) {
                this.setInputValue(name, data[name]);
            }
        });
    }

    /**
     * Builds form data object
     *
     * @return {{}} Object containing form element names as keys and corresponding values
     */
    collectData() {
        return this.inputNames.reduce((data, name)=>{
            this.writeInputValue(data, name);
            return data;
        }, {});
    }
}
