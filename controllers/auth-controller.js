const User = require('../models/user-model');
const authUtil = require('../util/authentication');
const userCredentialsAreValid = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req,res){
    let sessionData = sessionFlash.getSessionData(req);

    if(!sessionData) {
        sessionData = {
            email: '',
            password: '',
            fullname:''
        };
    }

    res.render('customer/auth/signup', { inputData:sessionData });
}

async function signup(req,res,next) {
    const enteredData = {
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.fullname
    }

    if(!userCredentialsAreValid(req.body.email, req.body.password, req.body.fullname)) {
        sessionFlash.flashDataToSession( 
            req, 
            {
                errorMessage: 
                    'Please check yout input.',
                ...enteredData
            }, 
            function() {
            res.redirect('/signup');
        })
        return;
    }

    const user = new User(
        null, // Add this line for the id parameter
        req.body.email,
        req.body.password,
        req.body.fullname
    );

    try {
      const existsAlready = await user.existsAlready();

      if(existsAlready) {
        sessionFlash.flashDataToSession(req, {
            errorMessage:'User already exists',
            ...enteredData
        }, function(){
            res.redirect('/signup');
        })
          return;
      }
      await user.signup();
    } catch (error) {
      next(error);
      return;
    }
    
    res.redirect('/signin');
}
function getSignin(req,res){
    let sessionData = sessionFlash.getSessionData(req);

    if(!sessionData){
        sessionData = {
            email:'',
            password:''
        };
    }
    res.render('customer/auth/signin', { inputData: sessionData });
}

async function signin(req,res, next) {
    const user = new User(null, req.body.email, req.body.password); // Add null for the id parameter
    let existingUser;
    try {
      existingUser = await user.getUserWithSameEmail();
    } catch (error) {
      next(error);
      return;
    }

    const sessionErrorData = {
        errorMessage: 'Invalid credentials',
        email:user.email,
        password: user.password 
    };

    if(!existingUser){
        sessionFlash.flashDataToSession(req, sessionErrorData, function(){
            res.redirect('/signin');
        })
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if(!passwordIsCorrect){
        sessionFlash.flashDataToSession(req, sessionErrorData, function(){
            res.redirect('/signin');
        })
        return;
    }

    authUtil.createUserSession(req, existingUser, function() {
        res.redirect('/');
    })
}

function logout(req,res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/');
}

module.exports = {
    getSignup: getSignup,
    getSignin: getSignin,
    signup:signup,
    signin:signin,
    logout: logout
};