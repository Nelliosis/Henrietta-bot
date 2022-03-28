// Require the necessary discord.js classes
const { Client, Intents, User } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log(`Henrietta Huckleberry, as needed, commanding: ${client.user.tag}`);
});

// Login to Discord with your client's token
client.login(token);