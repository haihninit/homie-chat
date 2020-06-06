const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    type: {type: String, default: "TEXT"},
    content: {type: String, required: true},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    room: {type: Schema.Types.ObjectId, ref: 'Room'}
}, {timestamps: true});

module.exports = MessageModel = mongoose.model('Message', MessageSchema);
