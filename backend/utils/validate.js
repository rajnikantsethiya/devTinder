const validator = require('validator');

const validateSignup = req => {
    const { firstName, lastName, emailId, password} = req.body;
    // firstname and last name check on schema level
    if (!validator.isEmail(emailId)) {
        throw new Error('Email id is not valid.');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Your password is not strong, try again!');
    }
};

const validateUpdatedData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'gender', 'skills'];
     if (Object.keys(req.body).every(key => allowedFields.includes(key))) {
        return true;
     } else {
        return false;
     }
}

module.exports = {
    validateSignup,
    validateUpdatedData
}