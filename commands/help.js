//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('See how to use Henrietta.'),
    async execute(interaction) {
        
        //declare user data
        const user = interaction.user;

        // report to log
        console.log('[BERRY OPERATION] /help was invoked.');

        //get necessary data
        const embed = new MessageEmbed();
        
        // report to log & user
        console.log('[BERRY OPERATION] Help printed.');
        embedder.Help(embed);

        await interaction.reply({embeds: [embed]});

    }
};