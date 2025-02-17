const Validator = require('validator');
const isEmpty = require('./is-empty')
module.exports = function validateRegisterInput(data){
    let errors = {};
    data.name = !isEmpty(data.name)? data.name: '';
    data.email = !isEmpty(data.email)? data.email: '';
    data.password = !isEmpty(data.password)? data.password: '';
    data.password2 = !isEmpty(data.password2)? data.password2: '';

    if(!Validator.isLength(data.name, {min: 2, max:30}))
    {
        errors.name = 'Name must be between 2 and 30 chars';
    }
    if(Validator.isEmpty(data.name))
    {
        errors.name = 'Name is Required';
    }
    if(!Validator.isEmail(data.email))
    {
        errors.email = 'email is not valid';
    }
    if(Validator.isEmpty(data.email))
    {
        errors.email = 'email is Required';
    }
    if(!Validator.isLength(data.password, {min: 6, max:30}))
    {
        errors.password = 'password must be at least 6 chars';
    }
    if(Validator.isEmpty(data.password))
    {
        errors.password = 'password is Required';
    }
    
    if(Validator.isEmpty(data.password2))
    {
        errors.password2 = 'password confirmation is Required';
    }
    if(!Validator.equals(data.password , data.password2))
    {
        errors.password2 = 'password must match';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};