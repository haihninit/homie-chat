const UserModel = require('../models/user');
const _ = require('lodash');

// Display list of all Authors.
exports.getUserList = async function(req, res) {
    res.status(200).json({success: true, data: await UserModel.find()});
};

// Display detail page for a specific Author.
exports.getUserDetail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Handle Author create on POST.
exports.createUser = async function(req, res, next) {
    const {fullName, username, password, confirmPassword, email} = req.body;
    if(_.isEmpty(fullName)) return next({status: 400, message: "Vui lòng nhập tên của bạn!"})
    if(_.isEmpty(username) && _.isEmpty(email)) return next({status: 400, message: "Vui lòng nhập tên người dùng hoặc email!"})
    let isUsernameExist = username && await UserModel.exists({username: username});
    let isEmailExist = email && await UserModel.exists({email: email});
    if(isUsernameExist || isEmailExist) return res.status(400).json({success: false, message: "Tên người dùng/email đã tồn tại!"})
    if(_.isEmpty(password)) return next({status: 400, message: "Vui lòng nhập mật khẩu!"})
    if(password.length < 6) return next({status: 400, message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự!"})
    if(_.isEmpty(confirmPassword)) return next({status: 400, message: "Vui lòng nhập lại mật khẩu!"})
    if(!(_.isEqual(password, confirmPassword))) return next({status: 400, message: "Mật khẩu không khớp!"})
    let user = new UserModel(req.body);
    let token = await user.generateAuthToken();
    user.save((err) => {
        if(!err){
            res.status(201).json({success: true, data: {user, token}})
        } else {
            console.log(err)
        }
    })
};

// Handle Author delete on POST.
exports.deleteUser = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Handle Author update on POST.
exports.updateUser = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};

exports.authenticate = async function (req, res, next) {
    if(_.isEmpty(req.body.username)) return next({status: 400, message: "Vui lòng nhập username/email!"});
    if(_.isEmpty(req.body.password)) return next({status: 400, message: "Vui lòng nhập mật khẩu!"});
    let auth = await UserModel.findByCredentials(req.body.username, req.body.password);
    if(!auth){
        return next({status: 400, message: "Tài khoản hoặc mật khẩu không chính xác!"})
    }
    res.status(200).json({success: true, data: auth, message: "Login successful!"});

};
