const generateTextMessage = (userName, text) => {
    return {
        userName,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (userName, url) => {
    return {
        userName,
        url,
        createdAt: new Date().getTime()
    }

}

module.exports = { generateTextMessage, generateLocationMessage }