const UserModel = require('../models/user');
module.exports = async function (req, res, next) {
    if(req.user){
        let user = await UserModel.findById(req.user._id);
        if(user){
            req.user = user
        }
    }
    next();
};
