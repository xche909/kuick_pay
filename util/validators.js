module.exports.validateRegisterInput = (username, email, password, confirmPassword, firstName, lastName) =>{
    const errors = {}
    if (username.trim() === ""){
        errors.username = "Username must not be empty"
    }
    if (firstName.trim() === ""){
        errors.firstName = "Firstname must not be empty"
    }
    if (lastName.trim() === ""){
        errors.lastName = "Lastname must not be empty"
    }
    if (confirmPassword.trim() === ""){
        errors.confirmPassword = "Confirm password must not be empty"
    }
    if (email.trim() === ""){
        errors.email = "Email must not be empty"
    } else{
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)){
            errors.email = "Email must be a valid email address"
        }
    }
    // do not need to trim password cuz we have have empty spaces for passwords as well
    if (password === ""){
        errors.password = "Password must not be empty"
    } 
    else if (password.length < 6){
        errors.password = "Password must be over 6 digits"
    }
    else if (password !== confirmPassword){
        errors.confirmPassword = "Passwords must match"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) =>{
    const errors = {};
    if (username.trim() === ""){
        errors.username = "Username must not be empty"
    }
    if (password === ""){
        errors.password = "Password must not be empty"
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validatePasswordPattern = (password) =>{
    const errors = {};
    if (password === ""){
        errors.password = "Password must not be empty"
    } 
    else if (password.length < 6){
        errors.password = "Password must be over 6 digits"
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validatePayForm = (senderAccountId, receiverAccountId, amount) =>{
    const errors = {};
    if (amount === ""){
        error.amount = "Please enter an amount"
    } 
    if (senderAccountId === ""){
        error.senderAccountId = "Sending account must not be empty"
    }

    if (receiverAccountId === ""){
        error.receiverAccountId = "Receiving account must not be empty"
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}