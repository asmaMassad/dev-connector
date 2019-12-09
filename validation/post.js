const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validatePostInput(data){
    let errors = {};
    data.text = !isEmpty(data.text)? data.text: '';
    
    if(!Validator.isLength(data.text, {min: 10, max:300}))
    {
        errors.text = ' post must between 10 to 300 chars ';
    }
    if(Validator.isEmpty(data.text))
    {
        errors.text = 'text is not valid';
    }
    
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};