//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

//internal
const queueHandler = require('../handlers/queueSystem');
const embedder = require('../handlers/utilities/embedder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Print\'s the queue to the chat.')
        .addNumberOption(option =>
            option.setName('page')
                .setDescription('Number')
                .setMinValue(1)),
    async execute(interaction) {
        
        //declare connection variables
        const guild = interaction.guild.id;
        const guildname = interaction.guild.name;
        const user = interaction.user;
        const embed = new MessageEmbed();
        const botConnection = getVoiceConnection(guild);
        const userConnection = interaction.member.voice.channel;

        // report to log
        console.log(`[BERRY OPERATION] ${user.username} invoked /queue`);

        //check for user connection
        if (!userConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /queue not connected to any voice channel. Returned.`);
            embedder.UserNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        //check for bot connection
        if (!botConnection) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /queue with Henrietta not active in any voice channel. Returned.`);
            embedder.BotNotConnected(embed, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }
        
        //check for queue data
        if (queueHandler.queueIsEmpty(guild)  && !queueHandler.queueCurrent(guild)) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /queue with empty queue. Returned.`);
            embedder.QueueEmpty(embed);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        let queue = queueHandler.retrieveQueue(guild);

        //COPYRIGHT
        //show Queue logic made by 3chospirits/NicoNicoNii. 
        //All rights reserved.

        const totalPages = Math.ceil(queue.length / 10) || 1;
        const page = (interaction.options.getNumber("page") || 1) - 1;

        if (page >= totalPages) {
            console.log(`[BERRY UNAUTHORIZED] ${user.username} tried invoking /queue with page that is greater than the queue length. Returned.`);
            embedder.InvalidPage(embed, totalPages, user);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        let queueString = queue.slice(page * 10, page * 10 + 10).map((track, i) => {
            return `**${page * 10 + i + 1}.** *${track.title}*\nDuration: \`[${track.duration}]\`\nRequester: ${track.user}`
        }).join("\n");
        
        const currentSong = queueHandler.queueCurrent(guild);

        // report to log & user
        console.log('[BERRY OPERATION] Print queue successful.');
        embedder.QueuePrinter(embed, currentSong, queueString, page, totalPages, user, guildname);
        await interaction.reply({embeds: [embed]});


    }
};