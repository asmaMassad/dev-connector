const Validator = require('validator');
const isEmpty = require('./is-empty')
module.exports = function validateloginInput(data){
    let errors = {};
    data.email = !isEmpty(data.email)? data.email: '';
    data.password = !isEmpty(data.password)? data.password: '';
 
    
    if(!Validator.isEmail(data.email))
    {
        errors.email = 'email is not valid';
    }
    if(Validator.isEmpty(data.email))
    {
        errors.email = 'email is Required';
    }
   
    if(Validator.isEmpty(data.password))
    {
        errors.password = 'password is Required';
    }
    
   
    return {
        errors,
        isValid: isEmpty(errors)
    };
};