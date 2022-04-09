const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause the player.'),
    async execute(interaction) {

        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /pause`);

        //get necessary data
        let connection = getVoiceConnection(interaction.guild.id);
        const player = connection.state.subscription.player; //copyright 28Goo
        
        player.pause();

        // report to log
        console.log('[BERRY OPERATION] Pause successful.');


        //todo embed
    }
};