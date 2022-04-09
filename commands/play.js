// external libraries
const play = require('play-dl');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    joinVoiceChannel,
    getVoiceConnection,
} = require('@discordjs/voice');

//internal
const queueHandler = require('../handlers/queueSystem');
const objectifier = require('../handlers/utilities/trackObjectifer');
const { startPlay } = require('../handlers/startPlay');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Commands Henrietta to play & queue music. Supports Spotify and YouTube.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('link, playlist or keywords.')
                .setRequired(true)),
    async execute(interaction) {

        // check user connection to VC
        if (!interaction.member.voice.channel) return interaction.reply("Connect to a Voice Channel first.");
        
        //declare connection variables
        const guild = interaction.guild.id;
        const user = interaction.user.username;
        let connection = getVoiceConnection(interaction.guild.id);

        //if no connection is established, connect
        if (!connection) {
            connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            //initialize queue
            queueHandler.makeQueue(guild, connection);
        }

        //refresh token
        if (play.is_expired()) await play.refreshToken();

        // Get input from option into a variable
        const input = interaction.options.getString('input');
        //report to log
        console.log(`[BERRY OPERATION] ${user} invoked /play with: ${input}`);

        //validate input
        let check = await play.validate(input);
        if (!check) {
            //todo
            //embed invalid url
            return;
        }

        //once validated, commence enqueue by platform
        switch (check) {
            case 'search':
            case 'yt_video':{
                //add song to queue
                const [track] = await play.search(input, { limit: 1 });
                const trackData = objectifier.trackObjectifier(track, 'yt', user);
                queueHandler.toQueue(guild, trackData);
                //report to log
                console.log("[BERRY NOTE] Successfully added to queue.");
                //todo embed
                break;}
            case 'sp_track':{
                //add song to queue
                const track = await play.spotify(input, { limit: 1 });
                const trackData = objectifier.trackObjectifier(track, 'sp', user);
                queueHandler.toQueue(guild, trackData);
                //report to log
                console.log("[BERRY NOTE] Successfully added to queue.");
                //todo embed
                break;}
            case 'yt_playlist': {
                //add songs to queue
                const songs = await play.playlist_info(input);
                const tracks = await songs.all_videos();
                for (const track of tracks) {
                    const trackData = objectifier.trackObjectifier(track, 'yt', user);
                    queueHandler.toQueue(guild, trackData);
                }
                //report to log
                console.log("[BERRY NOTE] Successfully added to queue.");
                //todo embed
                break;}
            case 'sp_playlist': {
                //add songs to queue
                const songs = await play.spotify(input);
                const tracks = await songs.all_tracks();
                for (const track of tracks) {
                    const trackData = objectifier.trackObjectifier(track, 'sp', user);
                    queueHandler.toQueue(guild, trackData);
                }
                //report to log
                console.log("[BERRY NOTE] Successfully added to queue.");
                //todo embed
                break;}
            case 'default': {
                //todo embed
                break;}
        }

        // Check if bot is playing. 
        // If playing, do not interrupt and return before startPlay executes
        // Copyright 28Goo
		const subscription = connection.state.subscription;
		if (subscription) {
			const playerStatus = subscription.player.state.status;
            if (playerStatus === 'playing') {
				return;
			}
		}

        await startPlay(interaction);
        
    }
};