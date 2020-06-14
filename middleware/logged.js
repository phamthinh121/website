const User = require('../models/User')
function isLoggedIn(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.isAuthenticated()){
        session={
        user:req.user
    }
    return next();
}
    res.redirect('/home');
}
module.exports = isLoggedIn