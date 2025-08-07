// This is a utility file for prefix-based commands
// It doesn't export a slash command, so it shouldn't be loaded by the command loader

const { SlashCommandBuilder } = require('@discordjs/builders');

// Helper function to handle prefix commands  
const handlePrefixMusicCommand = async (message, args, command) => {
    // Check if user is in a voice channel
    if (!message.member.voice.channel) {
        return message.channel.send('❌ You need to be in a voice channel to use music commands!');
    }

    const voiceChannel = message.member.voice.channel;
    const permissions = voiceChannel.permissionsFor(message.client.user);
    
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
        return message.channel.send('❌ I need permissions to join and speak in your voice channel!');
    }

    switch (command) {
        case 'play':
            // For prefix commands, we'd need to implement the music logic here
            // For now, suggest using slash commands
            return message.channel.send('🎵 Please use `/play song` slash command for music playback!');
            
        case 'skip':
            return message.channel.send('⏭️ Please use `/play skip` slash command!');
            
        case 'stop':
        case 'leave':
            return message.channel.send('⏹️ Please use `/play stop` slash command!');
            
        case 'pause':
            return message.channel.send('⏸️ Please use `/play pause` slash command!');
            
        case 'resume':
            return message.channel.send('▶️ Please use `/play resume` slash command!');
            
        case 'queue':
            return message.channel.send('📄 Please use `/play queue` slash command!');
            
        case 'clear':
            return message.channel.send('🗑️ Please use `/play clear` slash command!');
            
        default:
            return message.channel.send('❌ Unknown music command! Use `/play` slash commands instead.');
    }
};

// This file is for utilities only and doesn't export a slash command
module.exports = {
    handlePrefixMusicCommand
};
