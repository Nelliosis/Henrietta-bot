module.exports = {
    name: "messageCreate",
    async execute(message) {
        // change string to lowercase and reply
        if (message.content.toLowerCase() == "hi hetty") {
            await message.reply(`Hello, <@${message.author.id}>`);
        }
    },
};