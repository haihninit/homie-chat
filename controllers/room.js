const RoomModel = require('../models/room');
const _ = require('lodash');

exports.getListRoom = async function (req, res, next) {
    const {limit, offset} = req.query;
    let data = await RoomModel.find({members: req.user._id}).sort({ _id: -1 }).populate('members').skip(parseInt(offset)).limit(parseInt(limit));
    res.status(200).json({
        success: true,
        data,
        offset: parseInt(offset),
        limit: parseInt(limit)
    })
};
