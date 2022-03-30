module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.content.toLowerCase() == "hi hetty") {
            return message.reply(`Hello, <@${message.author.id}>`);
        }
    },
};