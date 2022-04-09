const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current track'),
    async execute(interaction) {

        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /skip`);

        //get necessary data
        let connection = getVoiceConnection(interaction.guild.id);
        const player = connection.state.subscription.player; //copyright 28Goo
        
        player.stop();

        // report to log
        console.log('[BERRY OPERATION] Skip successful.');

        //todo embed
    }
};