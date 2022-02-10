module.exports = {
    name: "say",
    category: "fun",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        msgSlice = message.content.slice(4).trim()
        message.reply(msgSlice)
    }
}
