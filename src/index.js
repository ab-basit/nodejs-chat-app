const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users')
const { generateTextMessage, generateLocationMessage } = require('./utils/messages')

app = express();
const server = http.createServer(app)
const io = socketio(server);
const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
    console.log('New web-socket connected')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({...options, id: socket.id })

        if (error)
            return callback(error);

        socket.join(user.room);

        socket.emit('message', generateTextMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateTextMessage('Admon', `${user.userName} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on('sendMessage', (text, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if (!user)
            return callback('you are not registered user')

        if (filter.isProfane(text))
            callback('profanity is not allowed!');

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
            io.to(user.room).emit('message', generateTextMessage('Admin', `${user.userName} left!`));
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