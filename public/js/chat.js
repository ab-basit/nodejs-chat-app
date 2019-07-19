const socket = io()

const $messageForm = document.querySelector('.message-form')
const $joinButton = document.querySelector('#join');
const $messageBtn = document.querySelector('#messageBtn')
const $locationBtn = document.querySelector('#locationBtn')

const { userName, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (text) => {
    console.log(text)
})

socket.on('locationMessage', (location) => {
    console.log(location)
})

socket.on('left', (msg) => {
    console.log(msg)
})

socket.on('roomData', (users) => {
    console.log(users)
})
$messageBtn.addEventListener('click', () => {
    const text = document.querySelector('input').value;
    socket.emit('sendMessage', text, (error) => {
        if (error)
            return console.log(error);
        console.log('Message Sent')
    });
})

$locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('geolocation is not supported by your browser');
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        socket.emit('sendLocation', { latitude, longitude }, (error) => {
            if (error)
                return console.log(error);
            console.log('location shared');
        })
    })
})


socket.emit('join', { userName, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }

})