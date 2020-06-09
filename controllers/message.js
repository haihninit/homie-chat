const MessageModel = require('../models/message');
const _ = require('lodash');

exports.getListMessageByRoom = async function (req, res, next) {
    const {roomId, limit, offset} = req.query;
    let data = await MessageModel.find({room: roomId}).sort({ createdAt: 'desc' }).skip(parseInt(offset)).limit(parseInt(limit));
    data.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
    res.status(200).json({
        success: true,
        data,
        offset: parseInt(offset),
        limit: parseInt(limit)
    })
};
