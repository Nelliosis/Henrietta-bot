const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('resume the player.'),
    async execute(interaction) {

        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /resume`);

        //get necessary data
        let connection = getVoiceConnection(interaction.guild.id);
        const player = connection.state.subscription.player; //copyright 28Goo
        
        player.unpause();

            // report to log
        console.log('[BERRY OPERATION] Resume successful.');

        //todo embed
    }
};