const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping Henrietta!'),
    async execute(interaction) {
        return interaction.reply('Yes?');
    },
};
