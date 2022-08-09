//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');
const queueHandler = require('../handlers/queueSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current track.')
        .addNumberOption(option =>
            option.setName('towards')
                .setDescription('Select a number to skip towards to.')),
    async execute(interaction) {
        const user = interaction.user;
        const guild = interaction.guild.id;
        // report to log
        console.log(`[BERRY OPERATION] ${user.username} invoked /skip`);

        //get necessary data
        const embed = new EmbedBuilder();
        const botConnection = getVoiceConnection(guild);
        const userConnection = interaction.member.voice.channel;

        //check for user connection
        if (!userConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /skip not connected to any voice channel. Returned.`);
            embedder.UserNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for bot connection
        if (!botConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /skip with Henrietta not active in any voice channel. Returned.`);
            embedder.BotNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }
        
        let TrackNum = interaction.options.getNumber("towards");

        if (!TrackNum) {
            //check for queue data
            if (queueHandler.queueIsEmpty(guild) && !queueHandler.queueCurrent(guild)) {
                console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /skip with empty queue. Returned.`);
                embedder.QueueEmpty(embed);
                await interaction.reply({ embeds: [embed] });
                return;
            }
            //skip function
            //since the play module is recursive this will simply play the next song
            const player = botConnection.state.subscription.player; //copyright 28Goo
            player.stop();

            // report to log & user
            console.log('[BERRY OPERATION] Skip successful.');
            embedder.Skip(embed, user);
            await interaction.reply({embeds: [embed]});
        }
        else {
            let TrackNum = interaction.options.getNumber("towards") - 1;
            //if the number entered is bigger than queue length, return error
            if (TrackNum > queueHandler.queueLength(guild)) {
                embedder.QueueBig(embed, user);
                await interaction.reply({embeds: [embed]});
                return;
            }
            
            const player = botConnection.state.subscription.player; //copyright 28Goo

            for (let i = 0; i < TrackNum; i++) {
                queueHandler.fromQueue(guild);
            }

            player.stop();
            
            // report to log & user
            console.log('[BERRY OPERATION] Skip towards successful.');
            embedder.Skip(embed, user);
            await interaction.reply({embeds: [embed]});
        }
    }
};