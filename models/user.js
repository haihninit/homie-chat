const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        trim: true,
        default: null
    },
    fullName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        default: null
    },
    password: {
        type: String,
        select: false, // No select
    },
    address: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
    },
    provider: {
        fb: {
            type: Object,
            default: null
        },
        google: {
            type: Object,
            default: null
        }
    },
    tokens: [
        {
            token: {
                type: String,
                select: false
            }
        }
    ]
},  {timestamps: true});

UserSchema.pre('save', function(next){
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

UserSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '2 days'});
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token
};

UserSchema.methods.comparePassword = function(password){
    return new Promise(resolve => {
        resolve(bcrypt.compareSync(password, this.password));
    })
};

UserSchema.statics.findByCredentials = async function(username, password) {
    const user = await this.findOne({$or: [
            {username: username},
            {email: username}
        ]}).select('password tokens');
    const isPasswordMatch = await user.comparePassword(password);
    if(isPasswordMatch){
        let token = await user.generateAuthToken();
        return {user: await this.findOne({$or: [
                    {username: username},
                    {email: username}
                ]}), token}
    }
    return null;
};

module.exports = UserModel = mongoose.model('User', UserSchema);
