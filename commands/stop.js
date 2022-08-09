//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
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
        const embed = new EmbedBuilder();
        const botConnection = getVoiceConnection(guild);
        const userConnection = interaction.member.voice.channel;

        //check for user connection
        if (!userConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /stop not connected to any voice channel. Returned.`);
            embedder.UserNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for bot connection
        if (!botConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /stop with Henrietta not active in any voice channel. Returned.`);
            embedder.BotNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for queue data
        if (queueHandler.queueIsEmpty(guild) && !queueHandler.queueCurrent(guild)) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /stop with empty queue. Returned.`);
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