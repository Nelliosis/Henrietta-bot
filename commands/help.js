//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('See how to use Henrietta.'),
    async execute(interaction) {
        
        //declare user data
        const user = interaction.user;

        // report to log
        console.log(`[BERRY OPERATION] ${user.username} invoked /help.`);

        //get necessary data
        const embed = new EmbedBuilder();
        
        // report to log & user
        console.log('[BERRY OPERATION] Help printed.');
        embedder.Help(embed);

        await interaction.reply({embeds: [embed]});

    }
};