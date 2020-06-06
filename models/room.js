const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    members: [{type: Schema.Types.ObjectId, ref: "User", required: true}],
    name: {type: String, required: true}
}, {timestamps: true});

module.exports = RoomModel = mongoose.model('Room', RoomSchema);

