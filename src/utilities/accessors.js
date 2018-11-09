

export class DOMElementAccessor {
    constructor(loader) {
        this.loader = loader;
    }
    getValue(element) {
        let ctrl = this.loader.getControl(element);
        if (ctrl) {
            if ("value" in ctrl) {
                return ctrl.value;
            }
        } else {
            if (element.type === "checkbox") {
                return !!element.checked;
            }
            return element.value || "";
        }
    }
    setValue(element, value) {
        let ctrl = this.loader.getControl(element);
        if (ctrl) {
            if ("value" in ctrl && (!("__lookupSetter__" in ctrl) || ctrl.__lookupSetter__("value"))) {
                ctrl.value = value;
            }
        } else {
            if (element.type === "checkbox") {
                element.checked = !!value;
            } else {
                element.value = value || "";
            }
        }
    }
}
