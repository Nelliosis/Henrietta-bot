//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('resume the player.'),
    async execute(interaction) {
        
        //declare user data
        const user = interaction.user;
        const guild = interaction.guild.id;

        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /resume`);

        //get necessary data
        const embed = new EmbedBuilder();
        const botConnection = getVoiceConnection(guild);
        const userConnection = interaction.member.voice.channel;

        //check for user connection
        if (!userConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /resume not connected to any voice channel. Returned.`);
            embedder.UserNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for bot connection
        if (!botConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /resume with Henrietta not active in any voice channel. Returned.`);
            embedder.BotNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for queue data
        if (queueHandler.queueIsEmpty(guild) && !queueHandler.queueCurrent(guild)) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /resume with empty queue. Returned.`);
            embedder.QueueEmpty(embed);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const player = botConnection.state.subscription.player; //copyright 28Goo
        player.unpause();

        // report to log & user
        console.log('[BERRY OPERATION] Resume successful.');
        embedder.Resume(embed, user);

        await interaction.reply({embeds: [embed]});

    }
};