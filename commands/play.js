// external library
const play = require('play-dl');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	AudioPlayerStatus,
    StreamType,
    NoSubscriberBehavior,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
// internal library
const searcher = require('../handlers/inputSearcher')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Tell Henrietta to play music. Supports the following services: YouTube & Spotify.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('input: link of playlist or video')
                .setRequired(true)),
    async execute(interaction) {

        //refresh the Spotify Token if expired
        if (play.is_expired()) await play.refreshToken();

        // Get input from option into a variable
        const input = interaction.options.getString('input');

        //report to log
        console.log(`[BERRY OPERATION] ${interaction.user.tag} invoked /play with query ${input}`);

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });


        // Set the player
        const stream = await searcher.inputSearcher(input);
        const resource = createAudioResource(stream.stream, { inputType: stream.type },);
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            },
        });


        // Play
        player.play(resource);
        connection.subscribe(player);

        // when error has occured, display the error
        player.on('error', error => {
        console.error(`[BERRY FATAL]: Play failed. ${error.message} with ${error.name}`);
        player.play(getNextResource());
        });

        console.log("[BERRY OPERATION] Play inititated.")
        // When the bot has transitioned to idle, disconnect
        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    }
};