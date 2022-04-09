// external libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

//internal libraries
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('clears the queue and stops the player.'),
    async execute(interaction) {

        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /stop`);
        //get necessary data
        const guild = interaction.guild.id;
        const connection = getVoiceConnection(guild);
        const player = connection.state.subscription.player; //copyright 28Goo
            
        //player.pause();
        queueHandler.clearQueue(guild);
        player.stop();   

        // report to log
        console.log('[BERRY OPERATION] Stop successful.');

        //todo embed
    }
};