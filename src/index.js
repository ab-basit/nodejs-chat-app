const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { addUser, getUser, removeUser } = require('./utils/users')

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
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user)
            io.to(user.room).emit('left', `${user.userName} left`)
    })
})

server.listen(port, () => {
    console.log(`listening at ${port}`)
})