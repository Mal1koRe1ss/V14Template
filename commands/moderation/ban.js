const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban members')
        .addUserOption(option => option.setName('user').setDescription('User to be banned').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Ban reason').setRequired(false)),

        async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply(`You need to have 'BanMembers' Flag to ban a member.`);
        }    

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const member = interaction.guild.members.fetch(user.id);

        if (member) {
            member.ban({ reason });
            interaction.followUp(`✅ <@${user.id}> banned, for reason : ${reason}`);
        } else {
            await interaction.followUp('❌ User not found.');
        }
    }
};