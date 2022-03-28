// Require the necessary discord.js classes
const { Client, Intents, User } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,                   // server administrative functions
        Intents.FLAGS.GUILD_MESSAGES,           // allows to send and receive messages
        Intents.FLAGS.GUILD_VOICE_STATES,       // allows voice channel entry
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,  // allows reactions
        Intents.FLAGS.DIRECT_MESSAGES           // allows bot to DM users
    ]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log(`Henrietta Huckleberry, as needed, commanding: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (message.content == "Hi Hetty") {
        message.reply(`Hello, ${message.author.username}`)
    }
})

// Login to Discord
client.login(token);