const User = require('../models/user-model');

function getSignup(req,res){
    res.render('customer/auth/signup');
}

async function signup(req,res) {
    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname
    );

    await user.signup();

    res.redirect('/login');
}
function getSignin(req,res){
    res.render('customer/auth/signin')
}

module.exports = {
    getSignup: getSignup,
    getSignin: getSignin,
    signup:signup
};