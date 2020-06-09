const UserModel = require('../models/user');
module.exports = async function (req, res, next) {
    if(req.user){
        const token = req.header('Authorization').replace('Bearer ', '');
        let user = await UserModel.findOne({_id: req.user._id, 'tokens.token': token}).select('-password');
        if(!user){
            res.status(401).json({ success: false, message: 'Not authorized to access this resource' })
            return;
        }
        req.user = user;
        req.token = token;
    }
    next();
};
