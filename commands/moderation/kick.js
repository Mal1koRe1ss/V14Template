const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick members')
        .addUserOption(option => option.setName('user').setDescription('User to be kicked').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Kick reason').setRequired(false)),

        async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply(`You need to have 'KickMembers' Flag to kick a member.`);
        }    

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const member = interaction.guild.members.fetch(user.id);

        if (member) {
            member.kick(reason);
            interaction.followUp(`✅ <@${user.id}> kicked, for reason : ${reason}`);
        } else {
            await interaction.followUp('❌ User not found.');
        }
    }
};