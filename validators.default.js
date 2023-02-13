let validators = {
    required: function () {
        return {
            name: 'required',
            event: 'input',
            message: 'This field is required.',
            validator: function (value) {
                return value.length > 0;
            }
        }
    },
    minLength: function (min) {
        return {
            name: 'minLength',
            event: 'input',
            message: `This field must contains ${min} chars min.`,
            validator: function (value) {
                return value.length >= min;
            }
        }
    },
    maxLength: function (max) {
        return {
            name: 'maxLength',
            event: 'input',
            message: `This field must contains ${max} chars max.`,
            validator: function (value) {
                return value.length <= max;
            }
        }
    },
    name: function () {
        return {
            name: 'simpleName',
            event: 'input',
            message: 'Special chars are forbidden.',
            validator: function (value) {
                let regexp = new RegExp("^[a-zA-Z0-9 -]*$", 'g');
                return regexp.test(value);
            }
        }
    },
    email: function () {
        return {
            name: 'email',
            event: 'input',
            message: "Invalid email format.",
            validator: function (value) {
                let regexp = new RegExp("^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$", 'g');
                return regexp.test(value);
            }
        }
    },
    date: function () {
        return {
            name: 'date',
            event: 'input',
            message: "Invalid date format.",
            validator: function (value) {
                let minYear = 1900;
                let maxYear = 2100;
                let error = false;
                let re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

                if (value !== '') {
                    let regs = value.match(re)

                    if (regs) {
                        if (regs[1] < 1 || regs[1] > 31) {
                            error = true;
                        } else if (regs[2] < 1 || regs[2] > 12) {
                            error = true;
                        } else if (regs[3] < minYear || regs[3] > maxYear) {
                            error = true;
                        }
                    } else {
                        error = true;
                    }
                }

                return !error;
            }
        }
    },
    time: function () {
        return {
            name: 'time',
            event: 'input',
            message: "Invalid time format.",
            validator: function (value) {
                let error = false;
                let re = /^(\d{1,2}):(\d{2})(:00)?([ap]m)?$/;

                if (value !== "") {
                    let regs = value.match(re);
                    if (regs) {
                        if (regs[1] > 23) {
                            error = true;
                        }
                        if (regs[2] > 59) {
                            error = true;
                        }
                    } else {
                        error = true;
                    }
                }

                return !error;
            }
        }
    },
    password: function (mode, minLength = 6) {
        let _messages = {
            'l': 'lower chars',
            'u': 'upper chars',
            'd': 'numbers',
            's': 'special chars'
        }
        let message = '';
        let splitted = mode.split('');
        for (let index in splitted) {
            let _mode = splitted[index];
            if (Object.prototype.hasOwnProperty.call(_messages, _mode)) {
                if(parseInt(index) === 0){
                    message += _messages[_mode];
                }else{
                    if (parseInt(index) === (splitted.length - 1)) {
                        message += ' and ' + _messages[_mode]
                    } else {
                        message += ', ' + _messages[_mode]
                    }
                }

            }
        }
        return {
            name: 'password',
            event: 'input',
            message: `The password must contain at least ${minLength} chars (${message}).`,
            validator: function (password) {
                let modes = {
                    'l': /[a-z]/,
                    'u': /[A-Z]/,
                    'd': /\d/,
                    's': /\W/
                }
                let result = [];
                if (password.length < minLength) {
                    return false;
                }
                for (let _mode of mode.split('')) {
                    if (Object.prototype.hasOwnProperty.call(modes, _mode)) {
                        result.push(modes[_mode].test(password));
                    }
                }
                return !(result.reduce((a, b) => a + b, 0) < mode.length)
            }
        }
    }
}
export default {
    get(name) {
        if (Object.prototype.hasOwnProperty.call(validators, name)) {
            return validators[name];
        }
        return false;
    }
}
