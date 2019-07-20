const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageForminput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationMsgTemplate = document.querySelector('#location-message-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
const $messages = document.querySelector('#messages');

const { userName, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messageTemplate, {
        userName: message.userName,
        createdAt: moment(message.createdAt).format('h:mm a'),
        message: message.text
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render($locationMsgTemplate, {
        userName: message.userName,
        createdAt: moment(message.createdAt).format('h:mm a'),
        url: message.url
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('roomData', (data) => {
    console.log(data)
    const html = Mustache.render($sidebarTemplate, {
        users: data.users,
        room: data.room
    });
    document.querySelector('#sidebar').innerHTML = html;
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = e.target.elements.message.value;
    socket.emit('sendMessage', text, (error) => {
        if (error)
            return console.log(error);
        console.log('Message Sent')
    });
})

$sendLocationButton.addEventListener('click', () => {
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