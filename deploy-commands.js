// external libraries
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config()

// set up the commands array
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// read commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.token);

// push the commands to client
rest.put(Routes.applicationCommands(process.env.clientId), { body: commands })
    .then(() => console.log('[BERRY NOTE]: Commands registered.'))
    .catch(console.error);


