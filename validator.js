import defaults from './validators.default.js'

let validator = function (form, assertions, valid) {
    let errors = {
        list: [],
        add: function (name, message, selfRemove) {
            if (Object.prototype.hasOwnProperty.call(form.elements, name)) {
                let target = form.elements[name];
                let self = this;
                let error = {
                    target: target,
                    message: message
                }
                if (selfRemove) {
                    error._bind = function (e) {
                        self.remove(error);
                    };
                    error.target.addEventListener('input', error._bind);
                }
                error._node = this.DOMInsert(error);
                this.list.push(error);
                return error;
            }
            return false;
        },
        remove: function (error) {
            let index = this.list.findIndex(item => item === error);
            this.DOMRemove(error);
            this.list.splice(index, 1);
        },
        DOMInsert: function (error) {
            let target = error.target;
            let template = document.getElementById('vjs-error-template');
            let container = document.createElement('div');
            container.append(template.content.cloneNode(true));
            let element = container.querySelector('[data-vjs-error-message]');
            element.innerText = error.message;
            target.parentElement.insertBefore(container, target.nextSibling);
            return container;
        },
        DOMRemove: function (error) {
            if (error._bind) {
                error.target.removeEventListener('input', error._bind);
            }
            error.target.parentElement.removeChild(error._node);
            return null;
        },
    }
    return {
        form: form,
        valid: valid ? valid : false,
        assertions: {},
        addError(field, message, selfRemove) {
            errors.add(field, message, selfRemove);
        },
        clearErrors() {
            for (let index in errors.list) {
                let error = errors.list[index];
                errors.DOMRemove(error);
                delete errors.list[index];
            }
        },
        assert() {
            let assertions = this.assertions;
            return !Object.keys(assertions).reduce(function (r, k) {
                return r.concat(Object.values(assertions[k]));
            }, []).includes(false);
        },
        renderAssertion(target, assertion) {
            let template = document.getElementById('vjs-error-template');
            let container = document.createElement('div');
            container.append(template.content.cloneNode(true));
            let element = container.querySelector('[data-vjs-error-message]');
            element.innerText = assertion.message;
            target.parentElement.insertBefore(container, target.nextSibling);
            return container;
        },
        eraseAssertion(target, assertion) {
            target.parentElement.removeChild(assertion._messageEl);
            return null;
        },
        assertElement(name, target, assertionName, assertion) {
            if (!Object.prototype.hasOwnProperty.call(this.assertions, name)) {
                this.assertions[name] = {};
            }
            let isValid = assertion.validator(target.value);
            this.assertions[name][assertionName] = isValid;
            this.valid = this.assert();
            if (false === isValid) {
                if (!assertion._messageEl) {
                    assertion._messageEl = this.renderAssertion(target, assertion);
                }
            } else {
                if (assertion._messageEl) {
                    assertion._messageEl = this.eraseAssertion(target, assertion)
                }
            }
        },
        initializeElement(element) {
            let self = this;
            let name = element.attributes.getNamedItem('name').value;
            self.assertions[name] = {};
            if (Object.prototype.hasOwnProperty.call(assertions, name)) {
                let _assertions = assertions[name];
                for (let assertion of _assertions) {
                    self.assertions[name][assertion.name] = false;
                    assertion._bind = self.assertElement.bind(self, name, element, assertion.name, assertion);
                    element.addEventListener(assertion.event ? assertion.event : 'blur', assertion._bind);
                }
            }
        },
        destroyElement(element) {
            let name = element.attributes.getNamedItem('name').value;
            if (Object.prototype.hasOwnProperty.call(assertions, name)) {
                let _assertions = assertions[name];
                for (let assertion of Object.values(_assertions)) {
                    element.removeEventListener(assertion.event ? assertion.event : 'blur', assertion._bind);
                }
            }
        },
        initialize() {
            let self = this;
            if (!form instanceof HTMLFormElement) {
                console.error('Validator.js : form must be an instance of HTMLFormElement')
                return false;
            }
            console.log(form, form.elements)
            for (let el of form.elements) {
                if (el.attributes.name) {
                    if (Object.prototype.hasOwnProperty.call(assertions, el.attributes.name.value)) {
                        self.initializeElement(el);
                    }
                }
            }
            return self;
        },
        destroy() {
            let self = this;
            for (let el of form.elements) {
                if (el.attributes.name) {
                    if (Object.prototype.hasOwnProperty.call(assertions, el.attributes.name.value)) {
                        self.destroyElement(el);
                    }
                }
            }
        }
    }
};

export default {
    defaults: defaults,
    create: validator
}
