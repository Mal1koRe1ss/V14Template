const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of messages to delete')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply(`You need to have 'ManageChannels' Flag to use this command.`);
        }

        const count = interaction.options.getInteger('amount');

        if (count < 1 || count > 100) {
            return interaction.reply('Please enter a amount between 1-100.');
        }

        const channel = interaction.channel;

        try {
            await interaction.reply({ content: '🔄 Messages are deleting...', ephemeral: true });
            await channel.bulkDelete(count, true);
            await interaction.followUp({ content: `✅ ${count} messages deleted.`, ephemeral: true });
        } catch (err) {
            console.log(`[ERROR] Error in clear command : ${err}`);
            await interaction.followUp({ content: '❌ An error occured while deleting the message(s)!', ephemeral: true });
        }
    },
};
