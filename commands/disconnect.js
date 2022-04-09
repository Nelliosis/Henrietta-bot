// external libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

//internal libraries
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('exits the voice channel and destroys the queue.'),
    async execute(interaction) {

        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /disconnect`);


        //get necessary data
        const guild = interaction.guild.id;
        const connection = getVoiceConnection(guild);
        const player = connection.state.subscription.player; //copyright 28Goo
        
        queueHandler.clearQueue(guild);
        player.stop();
        connection.destroy();

        // report to log
        console.log('[BERRY OPERATION] Disconnect successful.');

        //todo embed
    }
};