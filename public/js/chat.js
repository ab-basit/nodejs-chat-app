const socket = io()

const $messageForm = document.querySelector('.message-form')
const $joinButton = document.querySelector('#join');

const { userName, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (msg) => {
    console.log(msg)
})

socket.on('left', (msg) => {
    console.log(msg)
})


socket.emit('join', { userName, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }

})