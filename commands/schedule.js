//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Schedule an event to Google Calendar.'),
    async execute(interaction) {
        
        //declare user data
        const user = interaction.user;
        const guild = interaction.guild.id;
        
        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /schedule`);
        
        //get necessary data
        const embed = new MessageEmbed();
        
        //send link, embed and report to log & user
        embedder.Schedule(embed);
        console.log('[BERRY OPERATION] scheduling successful.');
        await interaction.reply({embeds: [embed]});
    }
};