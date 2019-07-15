const users = []

const addUser = (({ userName, id, room }) => {
    userName = userName.trim()
    room = room.trim()
    const user = users.find((user) => user.userName === userName && user.room === room)
    if (user)
        return;
    const newUser = { userName, room, id }
    users.push(newUser)
    return newUser;
})
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index >= 0) {
        return users.splice(index, 1)[0];
    }
}
module.exports = { addUser, getUser, removeUser }