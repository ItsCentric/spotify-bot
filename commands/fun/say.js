module.exports = {
    name: "say",
    category: "fun",
    permissions: [],
    devOnly: false,
    run: async ({client, message, prefix, args}) => {
        message.reply(message.content.slice(1))
    }
}

// TODO: FIX THIS