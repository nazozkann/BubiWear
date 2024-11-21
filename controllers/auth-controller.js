const User = require('../models/user-model');
const authUtil = require('../util/authentication');
const userCredentialsAreValid = require('../util/validation');

function getSignup(req,res){
    res.render('customer/auth/signup');
}

async function signup(req,res,next) {

    if(!userCredentialsAreValid(req.body.email, req.body.password, req.body.fullname)) {
        res.redirect('/signup');
        return;
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname
    );

    try {
      const existsAlready = await user.existsAlready();

      if(existsAlready) {
          res.redirect('/signup');
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
    res.render('customer/auth/signin')
}

async function signin(req,res, next) {
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    try {
      existingUser = await user.getUserWithSameEmail();
    } catch (error) {
      next(error);
      return;
    }

    if(!existingUser){
        res.redirect('/signin');
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if(!passwordIsCorrect){
        res.redirect('/signin');
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