// external libraries
const play = require('play-dl');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    joinVoiceChannel,
    getVoiceConnection,
} = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const { performance } = require('perf_hooks');

//internal
const queueHandler = require('../handlers/queueSystem');
const objectifier = require('../handlers/utilities/trackObjectifer');
const { startPlay } = require('../handlers/startPlay');
const embedder = require('../handlers/utilities/embedder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Commands Henrietta to play & queue music. Supports Spotify and YouTube.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('link, playlist or keywords.')
                .setRequired(true)),
    async execute(interaction) {
        //declare embed variable
        const embed = new MessageEmbed();
        
        //declare connection variables
        const guild = interaction.guild.id;
        const user = interaction.user;
        let connection = getVoiceConnection(guild);

        // check user connection to VC
        if (!interaction.member.voice.channel) {
            embedder.UserNotConnected(embed, user);
            await interaction.reply({embeds: [embed]});
            return;
        }

        //set performance variable
        const startTime = performance.now();

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
        console.log(`[BERRY OPERATION] ${user.username} invoked /play with: ${input}`);

        //validate input
        try {
            let check = await play.validate(input);
        } catch (e) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /play with an unsupported platform. Returned.`);
            embedder.InvalidChoice(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        let check = await play.validate(input);

        //if no input received then invalid
        if (!check){
            //embed
            embedder.InvalidChoice(embed, user);
            await interaction.reply({ embeds: [embed] });
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
                const endTime = performance.now();
                const performanceTime = endTime - startTime;
                console.log("[BERRY NOTE] Successfully added to queue.");
                //embed
                embedder.YTTrack(embed,track,user,performanceTime.toFixed(2));
                break;}
            case 'sp_track':{
                //add song to queue
                const track = await play.spotify(input, { limit: 1 });
                const trackData = objectifier.trackObjectifier(track, 'sp', user);
                queueHandler.toQueue(guild, trackData);
                //report to log
                const endTime = performance.now();
                const performanceTime = endTime - startTime;
                console.log("[BERRY NOTE] Successfully added to queue.");
                //embed
                embedder.SPTrack(embed, track, user, performanceTime.toFixed(2));
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
                const endTime = performance.now();
                const performanceTime = endTime - startTime;
                console.log("[BERRY NOTE] Successfully added to queue.");
                //embed
                embedder.YTPlaylist(embed,songs,user,performanceTime.toFixed(2));
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
                const endTime = performance.now();
                const performanceTime = endTime - startTime;
                console.log("[BERRY NOTE] Successfully added to queue.");
                //embed
                embedder.SPPlaylist(embed,songs,user,performanceTime.toFixed(2))
                break;}
            case 'sp_album': {
                const songs = await play.spotify(input);
                const tracks = await songs.all_tracks();
                for (const track of tracks) {
                    const trackData = objectifier.trackObjectifier(track, 'sp', user);
                    queueHandler.toQueue(guild, trackData);
                }
                //report to log
                const endTime = performance.now();
                const performanceTime = endTime - startTime;
                console.log("[BERRY NOTE] Successfully added to queue.");
                //embed
                embedder.SPAlbum(embed,songs,user,performanceTime.toFixed(2))
                break;}
            case 'default': {
                console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /play with an unsupported platform. Returned.`);
                embedder.InvalidChoice(embed, user);
                await interaction.reply({ embeds: [embed] });
                return;}
        }

        // Check if bot is playing. 
        // If playing, do not interrupt and return before startPlay executes
        // Copyright 28Goo
		const subscription = connection.state.subscription;
		if (subscription) {
			const playerStatus = subscription.player.state.status;
            if (playerStatus === 'playing') {
                await interaction.reply({embeds: [embed]});
				return;
			}
		}

        await interaction.reply({embeds: [embed]});
        await startPlay(interaction);
        
    }
};