// external libraries
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

// set up the commands array
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// read commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

// push the commands to client
rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log('[BERRY NOTE]: Commands registered.'))
    .catch(console.error);