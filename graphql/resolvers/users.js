const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { UserInputError } = require("apollo-server");
const { AuthenticationError } = require("apollo-server");
const checkAuth = require("../../util/checkAuth");

const {validateRegisterInput, validateLoginInput, validatePasswordPattern} = require("../../util/validators");
const {SECRET_KEY, emailPass} = require("../../config");

const User = require("../../models/User");

const generateToken = (user) =>{
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
    }, SECRET_KEY, { expiresIn: "1h" });

}

module.exports = {
    Query : {
        getUsers: async ()=>{
            try{
                const users = await User.find();
                return users;
            } catch(error){
                throw new Error(error);
            }

        }
    },

    Mutation: {
        register: async (_, {registerInput: {username, email, password, confirmPassword, firstName, lastName}},)=>{
            //Validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword, firstName, lastName);
            if (!valid){
                throw new UserInputError("Errors", {errors});
            }
            //Make sure user does not already exist
            const user = await User.findOne({username});
            if (user){
                throw new UserInputError("Username is taken", {
                    errors:{
                        username: "This username is taken"
                    }
                });
            }
            //Hash password and create an auth token
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                username,
                email,
                password,
                firstName,
                lastName,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            // Send user notification email of acount creation
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'johnnychen19990223@gmail.com',
                  pass: emailPass
                }
              });
              
              var mailOptions = {
                from: 'johnnychen19990223@gmail.com',
                to: email,
                subject: 'Thanks for joining Kuick Pay',
                text: `Hi, ${firstName} ${lastName}! Thanks for joining Kuick Pay! Your account has been created successfully.`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
        login: async (_,{username, password}) => {
            //validate user data
            const {valid, errors} = validateLoginInput(username, password);
            if (!valid){
                throw new UserInputError("Errors", {errors});
            }
            //check username exists
            const user = await User.findOne({username});
            if (!user){
                errors.general = "User not found";
                throw new UserInputError("User not found",{errors});
            }
            //check password correct
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = "Wrong credentials";
                throw new UserInputError("Wrong credentials",{errors});
            }
            
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token,
            }
        },

        changePassword: async (_,{username, password, newPassword, confirmNewPassword}, context)=>{
            //check auth
            const user = checkAuth(context);
            //check its the user themselves changing their passwords
            if (user.username !== username){
                throw new AuthenticationError("Action not allowed");
            }
            //check current password matches
            const userr = await User.findOne({username});
            const match = await bcrypt.compare(password, userr.password);
            if(!match){
                throw new UserInputError("Wrong credentials");
            }
            //check new password is valid
            const {errors, valid} = validatePasswordPattern(newPassword);
            if (!valid){
                throw new UserInputError("Errors", {errors});
            }
            //check if new password and confirm new password match
            if(newPassword!==confirmNewPassword){
                throw new UserInputError("Passwords do not match");
            }
            //change password
            passwordd = await bcrypt.hash(newPassword, 12);
            
            userr.password = passwordd;
            await userr.save();
            return userr;
        }
    }
}