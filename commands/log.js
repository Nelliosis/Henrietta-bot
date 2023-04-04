const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Check the logs'),
    async execute(interaction) {

        return interaction.reply('Check your logs');
    },
};
