const users = []

const addUser = (({ userName, id, room }) => {

    userName = userName.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!userName || !room)
        return { error: 'user name and room is required' }

    const existingUser = users.find((user) => user.userName === userName && user.room === room)
    if (existingUser)
        return { error: 'user name already in use' };

    const user = { userName, room, id }
    users.push(user)
    return { user };
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

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
}

module.exports = { addUser, getUser, removeUser, getUsersInRoom }