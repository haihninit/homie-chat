'use strict';
const RoomModel = require('../../models/room');
const MessageModel = require('../../models/message');
const mongoose = require('mongoose');
/* api/socket/index.js */

/*
  Configure socket.io events.
*/
let bootstrap = (io) => {
    // connection event
    let onlineList = [];
    io.on('connection', (socket) => {
        console.log('connected', socket.id)
        socket.emit('notify user', socket.username);
        socket.broadcast.emit('user connected', socket.username);

        socket.on('user join', (user) => {
            sendWelcomeMessage(user._id);
            if(!onlineList.some(item => item._id === user._id)){
                onlineList.push({...user, ...{socketId: socket.id}});
            }
            socket.broadcast.emit('user join', onlineList);
            io.emit('online list', onlineList);
        });

        // disconnect event
        socket.on('disconnect', () => {
            onlineList = onlineList.filter((el) => el.socketId !== socket.id);
            console.log('disconnected', socket.id);
            console.log(onlineList);
            socket.broadcast.emit('user disconnected', onlineList);
        });

        // chat message event
        socket.on('chat message', (params) => {
            const {room, sender, content, type} = params;
            sendMessage(room, sender, content, type);
        });

        // chat all
        socket.on('chat all', (message) => {
            console.log('chat all', message)
            io.emit('chat all', message);
        });

        // user typing event
        socket.on('user typing', (isTyping) => {
            if (isTyping === true) {
                socket.broadcast.emit('user typing', {
                    nickname: socket.username,
                    isTyping: true
                });
            } else {
                socket.broadcast.emit('user typing', {
                    nickname: socket.username,
                    isTyping: false
                });
            }
        });

        socket.on('create room', params => {
            let {owner, members, name} = params;
            createRoom(owner, members, name);
        });

        socket.on('join room', roomId => {
            console.log(roomId);
            joinRoom(roomId);
        });

        function createRoom(owner, members, name) {
            let room = new RoomModel({owner, members, name});
            room.save(err => {
                if(!err){
                    socket.emit('created room', room);
                    socket.broadcast.emit('invite to room', room);
                } else {
                    console.log(err)
                }
            })
        }

        function joinRoom(roomId) {
            socket.join(roomId)
        }

        async function sendMessage(room, sender, content, type) {
            let message = new MessageModel({type, content, sender, room});
            let chatRoom = await RoomModel.findById(room);
            console.log(message);
            console.log(room);
            socket.broadcast.emit('invite to room', chatRoom);
            message.save(err => {
                if(!err){
                    socket.to(room).emit('received message', message)
                } else {
                    io.to(socket.id).emit('send message failed', room);
                }
            });
        }

        async function sendWelcomeMessage(userId) {
            let chatRoom = await RoomModel.find({members: ["5ee09200ed620d0017e80e75", userId]});
            if(!chatRoom.length){
                let room = new RoomModel({owner: "5ee09200ed620d0017e80e75", members: ["5ee09200ed620d0017e80e75", userId], name: "Homie Bot"});
                room.save(err => {
                    if(!err){
                        let message = new MessageModel({
                            type: "TEXT",
                            content: "Chào mừng bạn đến với Homie Chat!",
                            sender: "5ee09200ed620d0017e80e75",
                            room: room._id});
                        message.save(err => {
                            if(!err){
                                socket.to(room).emit('received message', message)
                            } else {
                                io.to(socket.id).emit('send message failed', room);
                            }
                        });
                        socket.emit('created room', room);
                        socket.broadcast.emit('invite to room', room);
                    } else {
                        console.log(err)
                    }
                })
            }
        }

    });
};

module.exports = {
    bootstrap: bootstrap
};
