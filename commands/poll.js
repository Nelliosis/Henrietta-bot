//external
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
//internal
const embedder = require('../handlers/utilities/embedder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Initiate a simple poll.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('the question to be polled.')
                .setRequired(true)),
    async execute(interaction) {

        //declare variables
        const embed = new EmbedBuilder();
        const query = interaction.options.getString('query');
        const user = interaction.user;

        // report to log
        console.log(`[BERRY OPERATION] ${user.username} invoked /poll.`);

        // pass the query to the poll embedder
        embedder.Poll(embed, query, user);

        //reply and with emoji
       
        const emojiPoll =  await interaction.reply({ embeds: [embed],  fetchReply: true });
        emojiPoll.react('👍')
            .then(() => emojiPoll.react('🤷'))
            .then(() => emojiPoll.react('👎'))
            .catch(error => console.error('[BERRY ERROR] Some Emoji unable to react with error:', error));

        // report to log
        console.log('[BERRY OPERATION] Poll successfully printed.');


    }
};