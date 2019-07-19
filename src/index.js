const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users')
const { generateTextMessage, generateLocationMessage } = require('./utils/messages')

app = express();
const server = http.createServer(app)
const io = socketio(server);
const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
    console.log('New web-socket connected')

    socket.on('join', (user, callback) => {
        const newUser = addUser({...user, id: socket.id })
        if (!newUser)
            return callback('User with this name already exists!')
        socket.join(newUser.room);
        socket.emit('message', `welcome ${newUser.userName}`);
        socket.broadcast.to(newUser.room).emit('message', `${newUser.userName} has joined`);
        io.to(newUser.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    });

    socket.on('sendMessage', (text, callback) => {
        const user = getUser(socket.id);
        if (!user)
            return callback('you are not registered user')
        socket.broadcast.to(user.room).emit('message', generateTextMessage(user.userName, text));
        callback();
    })

    socket.on('sendLocation', ({ latitude, longitude } = {}, callback) => {
        const user = getUser(socket.id);
        if (!user)
            return callback('You are not registered');
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        socket.broadcast.to(user.room).emit('locationMessage', generateLocationMessage(user.userName, url));
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('left', `${user.userName} left`);
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
})

server.listen(port, () => {
    console.log(`listening at ${port}`)
})