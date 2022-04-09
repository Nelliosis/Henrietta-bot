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
        .addSubcommand(subcommand =>
            subcommand
                .setName('url')
                .setDescription('Loads a track from a URL')
                .addStringOption(option => option.setName('url').setDescription('Input song URL here.').setRequired(true))
)
        .addSubcommand(subcommand =>
            subcommand
                .setName('playlist')
                .setDescription('Loads tracks from a playlist')
                .addStringOption(option => option.setName('playlist').setDescription('Input the playlist link here.').setRequired(true))
        )
        .addSubcommand(subcommand =>
                subcommand
                    .setName('query')
                    .setDescription('Loads a track by keywords')
                    .addStringOption(option => option.setName('query').setDescription('Input your keywords here.').setRequired(true))
        ),
    
    async execute(interaction) {

        // check user connection to VC
        if (!interaction.member.voice.channel) return interaction.reply("[BERRY COMMAND DENIED] Connect to a Voice Channel first.");
        
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

        //subcommand handler & add data to queue
        if (interaction.options.getSubcommand() === "url") {
            // Get input from option into a variable
            const url = interaction.options.getString('url');
            //report to log
            console.log(`[BERRY OPERATION] ${user} invoked /play query by url with: ${url}`);

            //validate input
            let check = await play.validate(url);
            if (!check) {
                //todo
                //embed invalid url
                return;
            }

            switch (check) {
                case 'yt_video':{
                    //add song to queue
                    const [track] = await play.search(url, { limit: 1 });
                    const trackData = objectifier.trackObjectifier(track, 'yt', user);
                    queueHandler.toQueue(guild, trackData);
                    //report to log
                    console.log("[BERRY NOTE] Successfully added to queue.");
                    //todo embed
                    break;}
                case 'sp_track':{
                    //add song to queue
                    const [track] = await play.spotify(url, { limit: 1 });
                    const trackData = objectifier.trackObjectifier(track, 'sp', user);
                    queueHandler.toQueue(guild, trackData);
                    //report to log
                    console.log("[BERRY NOTE] Successfully added to queue.");
                    //todo embed
                    break;}
                case 'default':{
                    //todo embed
                    return;}
            }

        }
        else if (interaction.options.getSubcommand() === "playlist") {
            // Get input from option into a variable
            const playlist = interaction.options.getString('playlist');
            //report to log
            console.log(`[BERRY OPERATION] ${user} invoked /play query by playlist with: ${playlist}`);

            //validate input
            let check = await play.validate(playlist);
            if (!check) {
                //todo
                //embed invalid playlist
                return;
            }

            switch (check) {
                case 'yt_playlist': {
                    //add songs to queue
                    const songs = await play.playlist_info(playlist);
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
                    const songs = await play.spotify(playlist);
                    const tracks = await songs.all_tracks();
                    for (const track of tracks) {
                        const trackData = objectifier.trackObjectifier(track, 'sp', user);
                        queueHandler.toQueue(guild, trackData);
                    }
                    //report to log
                    console.log("[BERRY NOTE] Successfully added to queue.");
                    //todo embed
                    break;}
                case 'default':{
                    //todo embed
                    return;}
            }
        }
        else if (interaction.options.getSubcommand() === "query") {
            // Get input from option into a variable
            const query = interaction.options.getString('query');
            //report to log
            console.log(`[BERRY OPERATION] ${user} invoked /play query by keywords with: ${query}`);

            //validate input
            let check = await play.validate(query);
            if (!check) {
                //todo
                //embed invalid query
                return;
            }

            switch (check) {
                case 'search': {
                    //add song to queue
                    const [track] = await play.search(query, { limit: 1 });
                    const trackData = objectifier.trackObjectifier(track, 'yt', user);
                    queueHandler.toQueue(guild, trackData);
                    //report to log
                    console.log("[BERRY NOTE] Successfully added to queue.");
                    //todo embed
                    break;}
                case 'default':{
                    break;}
            }
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