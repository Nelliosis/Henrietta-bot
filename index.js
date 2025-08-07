// external libraries
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, IntentsBitField } = require('discord.js');
require('dotenv').config()

// client intents declaration
const myIntents = new IntentsBitField();
myIntents.add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
)
const client = new Client({ intents: [myIntents], });

// prepare and read commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Only set commands that have a data property (slash commands)
    if (command.data) {
        client.commands.set(command.data.name, command);
    }
}

// prepare and read events
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

// Handle prefix-based commands for backwards compatibility  
const prefix = '!!';
client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Music commands
    const musicCommands = ['play', 'skip', 'stop', 'leave', 'pause', 'resume', 'queue', 'clear'];
    if (musicCommands.includes(commandName)) {
        const { handlePrefixMusicCommand } = require('./commands/music');
        try {
            await handlePrefixMusicCommand(message, args, commandName);
        } catch (error) {
            console.error('[BERRY ERROR] Prefix music command error:', error);
            message.channel.send('❌ An error occurred with the music command!');
        }
        return;
    }

    // Handle other prefix commands here if needed
    if (commandName === 'commands' || commandName === 'help') {
        message.channel.send('🎵 **Music Commands:**\n`/play song <song>` - Play a song\n`/play skip` - Skip current song\n`/play stop` - Stop and leave\n`/play pause` - Pause current song\n`/play resume` - Resume paused song\n`/play queue` - Show queue\n`/play clear` - Clear queue');
        return;
    }
});

// call commands on interaction
client.on('interactionCreate', async interaction => {
    // if not a command, ignore
    if (!interaction.isChatInputCommand()) return;

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
client.login(process.env.token);