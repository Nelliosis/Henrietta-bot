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

// prepare and read event directory
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

//read commands directory
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
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
        await interaction.reply({ content: '[BERRY FATAL]: Error during execution', ephemeral: true });
    }
});



// Login to Discord
client.login(token);