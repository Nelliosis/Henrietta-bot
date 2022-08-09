// external libraries
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('../config.json');

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
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// prepare and read event directory
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// prepare and read commands directory
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}


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
        await interaction.reply({ content: '[BERRY FATAL]: Error during execution. See console log for details.', ephemeral: false });
    }
});



// Login to Discord
client.login(token);