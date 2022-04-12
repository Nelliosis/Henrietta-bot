const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const embedder = require('./embedder');

//playMessage module made by 28Goo/Cyntacs. All rights reserved.
module.exports = {
	playMessage: async (interaction, queueHead) => {
		const embed = new MessageEmbed;
		embedder.NowPlaying(embed, queueHead);
		const msg = await interaction.channel.send({ embeds: [embed] });

		const connection = getVoiceConnection(interaction.guild.id);
		const player = connection.state.subscription.player;

		player.on(AudioPlayerStatus.Idle, () => {
			msg.delete()
			.catch(error => {
				if (error.code === 1008) console.error('[BERRY NOTE] Message already deleted.');
			});
		});
	},
};