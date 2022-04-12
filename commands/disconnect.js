//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('exits the voice channel and destroys the queue.'),
    async execute(interaction) {
        //declare user data
        const user = interaction.user;
        const guild = interaction.guild.id;

        // report to log
        console.log(`[BERRY OPERATION] ${interaction.user.username} invoked /disconnect`);


        //get necessary data
        const embed = new MessageEmbed();
        const botConnection = getVoiceConnection(guild);
        const userConnection = interaction.member.voice.channel;

        //check for user connection
        if (!userConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /disconnect not connected to any voice channel. Returned.`);
            embedder.UserNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for bot connection
        if (!botConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /disconnect with Henrietta not active in any voice channel. Returned.`);
            embedder.BotNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const player = botConnection.state.subscription.player; //copyright 28Goo        
        queueHandler.clearQueue(guild);
        player.stop();
        botConnection.destroy();

        // report to log & user
        console.log('[BERRY OPERATION] Disconnect successful.');
        embedder.Disconnect(embed, user);

        await interaction.reply({embeds: [embed]});

        
    }
};