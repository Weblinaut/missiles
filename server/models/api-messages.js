'use strict';
let ApiMessages = function () { };
ApiMessages.EMAIL_NOT_FOUND = {errorCode: 0, errorMsg: 'Error: E-mail not found'};
ApiMessages.LOGIN_FAILED = {errorCode: 1, errorMsg: 'Error: Login Failed'};
ApiMessages.DB_ERROR = {errorCode: 2, errorMsg: 'Error: Database error'};
ApiMessages.NOT_FOUND = {errorCode: 3, errorMsg: 'Error: Not found'};
ApiMessages.EMAIL_ALREADY_EXISTS = {errorCode: 4, errorMsg: 'Error: E-mail already exists'};
ApiMessages.COULD_NOT_CREATE_USER = {errorCode: 5, errorMsg: 'Error: Could not create user'};
ApiMessages.PASSWORD_RESET_EXPIRED = {errorCode: 6, errorMsg: 'Error: Password reset has expired'};
ApiMessages.PASSWORD_RESET_HASH_MISMATCH = {errorCode: 7, errorMsg: 'Error: Password reset hash mismatched'};
ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH = {errorCode: 8, errorMsg: 'Error: Password reset e-mail mismatch'};
ApiMessages.COULD_NOT_RESET_PASSWORD = {errorCode: 9, errorMsg: 'Error: Could not reset password'};
ApiMessages.NEW_PASSWORD_FAILS_REQUIREMENTS = {errorCode: 10, errorMsg: 'Error: Password does not meet security requirements'};
ApiMessages.NEW_PASSWORDS_MISMATCH = {errorCode: 11, errorMsg: 'Error: Passwords do not match'};//registration or create new password, they need to match

module.exports = ApiMessages;