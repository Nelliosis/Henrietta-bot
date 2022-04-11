//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('clears the queue and stops the player.'),
    async execute(interaction) {
        
        //declare user data
        const user = interaction.user;
        const guild = interaction.guild.id;
        
        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /stop`);
        
        //get necessary data
        const embed = new MessageEmbed();
        const botConnection = getVoiceConnection(guild);
        const userConnection = interaction.member.voice.channel;

        //check for user connection
        if (!userConnection) {
            embedder.UserNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for bot connection
        if (!botConnection) {
            embedder.BotNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for queue data
        if (queueHandler.queueIsEmpty(guild)) {
            embedder.QueueEmpty(embed);
            await interaction.reply({ embeds: [embed] });
            return;
        }
        
        //stop functions
        const player = botConnection.state.subscription.player; //copyright 28Goo
        queueHandler.clearQueue(guild);
        player.stop();   

        // report to log & user
        console.log('[BERRY OPERATION] Stop successful.');
        embedder.Stop(embed, user);

        await interaction.reply({embeds: [embed]});
    }
};