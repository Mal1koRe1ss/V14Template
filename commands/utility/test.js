const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Basic response test'),
    async execute(interaction) {
        await interaction.reply('Online!');
    }
};