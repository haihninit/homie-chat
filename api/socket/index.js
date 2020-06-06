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
            socket.broadcast.emit('invite to room', chatRoom);
            message.save(err => {
                if(!err){
                    socket.to(room).emit('received message', message)
                } else {
                    io.to(socket.id).emit('send message failed', room);
                }
            });
        }

    });
};

module.exports = {
    bootstrap: bootstrap
};
