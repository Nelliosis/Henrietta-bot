// external libraries
const play = require('play-dl');
const ytdl = require('youtube-dl-exec');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    joinVoiceChannel,
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior,
} = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const os = require('os');

//internal
const queueHandler = require('../handlers/queueSystem');
const objectifier = require('../handlers/utilities/trackObjectifer');
const { startPlay } = require('../handlers/startPlay');
const embedder = require('../handlers/utilities/embedder');

// Create temp directory for audio files
const TEMP_DIR = path.join(os.tmpdir(), 'henrietta-music-bot');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Clean up old temp files on startup
const cleanupOldFiles = () => {
    try {
        const files = fs.readdirSync(TEMP_DIR);
        const now = Date.now();
        
        files.forEach(file => {
            const filePath = path.join(TEMP_DIR, file);
            const stats = fs.statSync(filePath);
            
            // Remove files older than 1 hour
            if (now - stats.mtime.getTime() > 3600000) {
                fs.unlinkSync(filePath);
                console.log(`[BERRY CLEANUP] Removed old temp file: ${file}`);
            }
        });
    } catch (error) {
        console.error('[BERRY ERROR] Error during temp file cleanup:', error);
    }
};

// Run cleanup on module load
cleanupOldFiles();

// Queue system for managing music
const queue = new Map();

// Download audio from YouTube using youtube-dl-exec
async function downloadAudio(videoUrl) {
    console.log(`[BERRY OPERATION] Downloading audio from: ${videoUrl}`);

    // Generate a unique filename based on timestamp
    const timestamp = Date.now();
    const outputTemplate = path.join(TEMP_DIR, `audio-${timestamp}.%(ext)s`);

    try {
        // Use youtube-dl-exec to download audio only
        await ytdl(videoUrl, {
            extractAudio: true,
            audioFormat: 'mp3',
            audioQuality: 0, // Best quality
            output: outputTemplate,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0'],
        });

        // Find the actual downloaded file
        const possibleExtensions = ['mp3', 'webm', 'm4a', 'ogg'];
        let actualFile = null;
        
        for (const ext of possibleExtensions) {
            const testFile = path.join(TEMP_DIR, `audio-${timestamp}.${ext}`);
            if (fs.existsSync(testFile)) {
                actualFile = testFile;
                break;
            }
        }

        if (!actualFile) {
            throw new Error('Downloaded file not found');
        }

        console.log(`[BERRY OPERATION] Downloaded audio to: ${actualFile}`);
        return actualFile;

    } catch (error) {
        console.error('[BERRY ERROR] Error downloading audio:', error);
        throw error;
    }
}

// Set up server queue and connection
const setUpServerQueue = async (interaction, voiceChannel, song) => {
    const queueConstructor = {
        voiceChannel: voiceChannel,
        textChannel: interaction.channel,
        connection: null,
        player: createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        }),
        songs: [],
        currentSong: null
    };

    // Create queue and add song
    queue.set(interaction.guild.id, queueConstructor);
    const serverQueue = queue.get(interaction.guild.id);
    serverQueue.songs.push(song);

    try {
        // Connect bot to voice channel
        serverQueue.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        // Subscribe player to connection
        serverQueue.connection.subscribe(serverQueue.player);
        
        // Set up player event handlers
        setupPlayerEvents(interaction, serverQueue);

        // Notify user that song is being set up
        await interaction.editReply(`🎵 Setting up: **${song.title}**`);

        // Start playing the first song
        await videoPlayer(interaction, serverQueue.songs.shift());

    } catch (error) {
        queue.delete(interaction.guild.id);
        throw error;
    }
};

// Set up player event listeners
const setupPlayerEvents = (interaction, serverQueue) => {
    // Handle player errors
    serverQueue.player.on('error', async error => {
        console.error(`[BERRY ERROR] Audio player error: ${error}`);
        
        // Try to play next song on error
        serverQueue.player.stop();
        if (serverQueue.songs.length === 0) {
            await clearQueue(interaction.guild, serverQueue);
        } else {
            interaction.channel.send('Song failed to play, skipping to next...');
            await videoPlayer(interaction, serverQueue.songs.shift());
        }
    });

    // Handle when song finishes
    serverQueue.player.on(AudioPlayerStatus.Idle, async () => {
        // Clean up temp file
        if (serverQueue.currentSong) {
            console.log(`[BERRY OPERATION] Cleaning up temp file: ${serverQueue.currentSong}`);
            try {
                if (fs.existsSync(serverQueue.currentSong)) {
                    fs.unlinkSync(serverQueue.currentSong);
                    console.log(`[BERRY OPERATION] Successfully removed: ${serverQueue.currentSong}`);
                } else {
                    console.log(`[BERRY WARNING] File already removed: ${serverQueue.currentSong}`);
                }
            } catch (err) {
                console.error('[BERRY ERROR] Error removing temp file:', err);
            }
        }

        // Play next song or end queue
        if (serverQueue.songs.length === 0) {
            await clearQueue(interaction.guild, serverQueue);
        } else {
            await videoPlayer(interaction, serverQueue.songs.shift());
        }
    });
};

// Video player function
const videoPlayer = async (interaction, song) => {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue) return;

    try {
        // Download audio from YouTube
        const audioFile = await downloadAudio(song.url);
        
        // Create audio stream and resource
        const audioStream = fs.createReadStream(audioFile);
        serverQueue.currentSong = audioFile;

        const resource = createAudioResource(audioStream, {
            inlineVolume: true
        });

        // Start playing
        serverQueue.player.play(resource);
        await interaction.channel.send(`🎶 Now Playing: **${song.title}**`);

    } catch (error) {
        console.error(`[BERRY ERROR] Video player failure: ${error}`);
        await interaction.channel.send('Failed to play song, trying next...');
        
        if (serverQueue.songs.length === 0) {
            await clearQueue(interaction.guild, serverQueue);
        } else {
            await videoPlayer(interaction, serverQueue.songs.shift());
        }
    }
};

// Add song to existing queue
const addSongToQueue = async (interaction, serverQueue, song) => {
    serverQueue.songs.push(song);
    return interaction.editReply(`✅ **${song.title}** added to queue!`);
};

// Get song URL and info
const getSongURL = async (interaction, args) => {
    const input = args.join(' ');
    
    if (play.validate(input) && await play.validate(input) !== "search") {
        const songInfo = await play.video_info(input);
        return { title: songInfo.video_details.title, url: songInfo.video_details.url };
    } else {
        // Search for video
        const video = await play.search(input, { limit: 1 });
        
        if (video && video.length > 0) {
            return { title: video[0].title, url: video[0].url };
        } else {
            throw new Error('Unable to find video');
        }
    }
};

// Skip current song
const skipSong = async (interaction, serverQueue) => {
    if (!serverQueue || serverQueue.songs.length === 0) {
        return interaction.editReply('❌ No songs in queue to skip!');
    }
    
    serverQueue.player.stop();
    await interaction.editReply('⏭️ Skipped current song!');
};

// Stop playing and clear queue
const stopSong = async (interaction, serverQueue) => {
    if (!serverQueue || !serverQueue.connection) {
        return interaction.editReply('❌ Bot not connected!');
    }
    
    await clearQueue(interaction.guild, serverQueue);
    await interaction.editReply('⏹️ Stopped playing and left voice channel!');
};

// Pause current song
const pauseSong = async (interaction, serverQueue) => {
    if (!serverQueue || !serverQueue.player) {
        return interaction.editReply('❌ Nothing is playing!');
    }
    
    serverQueue.player.pause();
    await interaction.editReply('⏸️ Paused current song!');
};

// Resume current song
const resumeSong = async (interaction, serverQueue) => {
    if (!serverQueue || !serverQueue.player) {
        return interaction.editReply('❌ Nothing is paused!');
    }
    
    serverQueue.player.unpause();
    await interaction.editReply('▶️ Resumed current song!');
};

// Show current queue
const showQueue = async (interaction, serverQueue) => {
    if (!serverQueue || serverQueue.songs.length === 0) {
        return interaction.editReply('❌ Queue is empty!');
    }
    
    const queueList = serverQueue.songs.map((song, index) => 
        `${index + 1}. **${song.title}**`
    ).join('\n');
    
    const embed = new EmbedBuilder()
        .setTitle('🎵 Current Queue')
        .setDescription(queueList)
        .setColor('#0099ff');
        
    await interaction.editReply({ embeds: [embed] });
};

// Clear queue and disconnect
const clearQueue = async (guild, serverQueue) => {
    if (serverQueue.currentSong) {
        try {
            if (fs.existsSync(serverQueue.currentSong)) {
                fs.unlinkSync(serverQueue.currentSong);
                console.log(`[BERRY OPERATION] Successfully removed: ${serverQueue.currentSong}`);
            } else {
                console.log(`[BERRY WARNING] File already removed: ${serverQueue.currentSong}`);
            }
        } catch (err) {
            console.error('[BERRY ERROR] Error removing temp file:', err);
        }
    }
    
    if (serverQueue.connection) {
        serverQueue.connection.destroy();
    }
    
    queue.delete(guild.id);
};

// Set up song (main function called by execute)
const setUpSong = async (interaction, args, serverQueue, voiceChannel) => {
    if (!args || args.length === 0) {
        return interaction.editReply('❌ You need to specify a song to play!');
    }

    try {
        const song = await getSongURL(interaction, args);
        
        if (!serverQueue) {
            await setUpServerQueue(interaction, voiceChannel, song);
        } else {
            await addSongToQueue(interaction, serverQueue, song);
        }
    } catch (error) {
        console.error(`[BERRY ERROR] Setup song error: ${error}`);
        await interaction.editReply('❌ Failed to find or queue the song!');
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Music commands for Henrietta bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('song')
                .setDescription('Play a song or add it to queue')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('Song name or YouTube URL')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('Skip the current song'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop playing and leave voice channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('Pause the current song'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resume')
                .setDescription('Resume the paused song'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription('Show the current queue'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Clear the entire queue')),
    
    async execute(interaction) {
        // Check if user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply('❌ You need to be in a voice channel to use music commands!');
        }

        const voiceChannel = interaction.member.voice.channel;
        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply('❌ I need permissions to join and speak in your voice channel!');
        }

        const serverQueue = queue.get(interaction.guild.id);
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'song':
                    const query = interaction.options.getString('query');
                    await interaction.deferReply();
                    await setUpSong(interaction, [query], serverQueue, voiceChannel);
                    break;
                    
                case 'skip':
                    await interaction.deferReply();
                    await skipSong(interaction, serverQueue);
                    break;
                    
                case 'stop':
                    await interaction.deferReply();
                    await stopSong(interaction, serverQueue);
                    break;
                    
                case 'pause':
                    await interaction.deferReply();
                    await pauseSong(interaction, serverQueue);
                    break;
                    
                case 'resume':
                    await interaction.deferReply();
                    await resumeSong(interaction, serverQueue);
                    break;
                    
                case 'queue':
                    await interaction.deferReply();
                    await showQueue(interaction, serverQueue);
                    break;
                    
                case 'clear':
                    await interaction.deferReply();
                    if (serverQueue) {
                        await clearQueue(interaction.guild, serverQueue);
                        await interaction.editReply('🗑️ Queue cleared and stopped playing!');
                    } else {
                        await interaction.editReply('❌ No queue to clear!');
                    }
                    break;
                    
                default:
                    await interaction.reply('❌ Unknown music command!');
            }
        } catch (error) {
            console.error(`[BERRY ERROR] Music command error: ${error}`);
            
            if (interaction.deferred) {
                await interaction.editReply('❌ An error occurred while processing the music command!');
            } else {
                await interaction.reply('❌ An error occurred while processing the music command!');
            }
        }
    },
    
    // Export the queue for other modules to use
    queue
};