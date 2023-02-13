# Validator.js

Validator.js is a simple front-end validation tool.

# How to use
### 1. Copy the error template in your HTML
```html
<template id="vjs-error-template">
  <p class="label label-error" data-vjs-error-message></p>
</template>
```
### 2. Initialize validatorJS for your form
```javascript
let validatorjs = require('validatorjs');
let validator = validatorjs.create(document.getElementById('myform'), {
    firstname: [
        validatorjs.defaults.get('required')(),
        validatorjs.defaults.get('name')(),
    ],
    lastname: [
        validatorjs.defaults.get('required')(),
      (function lastNameMustBeBob(){
        return {
          event: 'blur',
          message: `The lastname must be Bob.`,
          validator: function (value) {
            return value === 'Bob';
          }
        }
      })(),
    ],
    email: [
        validatorjs.defaults.get('required')(),
        validatorjs.defaults.get('email')(),
    ],
    password: [
        validatorjs.defaults.get('required')(),
        validatorjs.defaults.get('password')('ld'),
    ]
});
validator.initialize();
```

# Api

- validatorjs.create : function(form (HTMLFormElement), assertions (Object))
    - Create a new validation Object for this form. Assertions name must match the name attribute in the form.
