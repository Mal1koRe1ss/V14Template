const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boom')
        .setDescription('Resets the channel'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply(`You need to have 'ManageChannels' Flag to use this command.`);
        }

        await interaction.deferReply();

        const channel = interaction.channel;

        try {
            const newChannel = await channel.clone();
            await interaction.editReply('🔄 Channel is deleting...');
            await channel.delete();
            await newChannel.send('✅ Channel deleted.');
        } catch (err) {
            console.log(`[ERROR] Error in boom command : ${err}`);
            await interaction.editReply('❌ An error occured while deleting the channel!');
        }
    },
};