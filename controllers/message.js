const MessageModel = require('../models/message');
const _ = require('lodash');

exports.getListMessageByRoom = async function (req, res, next) {
    const {roomId, limit, offset} = req.query;
    let data = await MessageModel.find({room: roomId}).sort({ _id: -1 }).skip(parseInt(offset)).limit(parseInt(limit));
    res.status(200).json({
        success: true,
        data,
        offset: parseInt(offset),
        limit: parseInt(limit)
    })
};
