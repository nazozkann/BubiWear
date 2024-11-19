function getSignup(req,res){
    res.render('customer/auth/signup');
}
function getSignin(req,res){
    //..
}

module.exports = {
    getSignup: getSignup,
    getSignin: getSignin
};