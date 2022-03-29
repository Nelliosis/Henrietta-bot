// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
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

//prepare commands directory to be read
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//read commands directory
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// When the client is ready, run
client.once('ready', () => {
    console.log('Welcome, Henrietta Huckleberry.');
    console.log(`Connected to the Berry Network as: ${client.user.tag}`);

});

// call commands on interaction
client.on('interactionCreate', async interaction => {
    // if not a command, ignore
    if (!interaction.isCommand()) return;

    //collect commands from the collection
    const command = client.commands.get(interaction.commandName);

    // if not a command, ignore
    if (!command) return;

    // execute if a command, catch e if not
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Berry Network: Error during execution', ephemeral: true });
    }
});


// Hello message
client.on("messageCreate", (message) => {
    if (message.content == "Hi Hetty") {
        message.reply(`Hello, <@${message.author.id}>`)
    }
})

// Login to Discord
client.login(token);