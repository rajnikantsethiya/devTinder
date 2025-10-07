const validator = require('validator');

const validateSignup = req => {
    const { emailId, password } = req.body;
    // firstname and last name check on schema level
    if (!validator.isEmail(emailId)) {
        return { message: 'Email id is not valid.', code: 401, data: null };
    } else if (!validator.isStrongPassword(password)) {
        return { message: 'Your password is not strong, try again!', code: 402, data: null };
    }
};

const validateUpdatedData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'bio', 'photoUrl', 'age', 'skills'];
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