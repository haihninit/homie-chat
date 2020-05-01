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
exports.createUser = async function(req, res) {
    const {fullName, username, password, confirmPassword, email} = req.body;
    if(_.isEmpty(fullName)) throw {status: 400, message: "Vui lòng nhập tên của bạn!"}
    if(_.isEmpty(username) && _.isEmpty(email)) throw {status: 400, message: "Vui lòng nhập tên người dùng hoặc email!"}
    let isUsernameExist = username && await UserModel.exists({username: username});
    let isEmailExist = email && await UserModel.exists({email: email});
    if(isUsernameExist || isEmailExist) return res.status(400).json({success: false, message: "Tên người dùng/email đã tồn tại!"})
    if(_.isEmpty(password)) throw {status: 400, message: "Vui lòng nhập mật khẩu!"}
    if(password.length < 6) throw {status: 400, message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự!"}
    if(_.isEmpty(confirmPassword)) throw {status: 400, message: "Vui lòng nhập lại mật khẩu!"}
    if(!(_.isEqual(password, confirmPassword))) throw {status: 400, message: "Mật khẩu không khớp!"}
    let user = new UserModel(req.body);
    user.save((err) => {
        if(!err){
            res.status(201).json(user)
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
    res.status(200).json(auth);
};
