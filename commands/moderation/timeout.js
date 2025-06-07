const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout members')
        .addUserOption(option => option.setName('user').setDescription('User to be timeouted').setRequired(true))
        .addIntegerOption(option => option.setName('time').setDescription('Timeout Duration').addChoices(
                    { name: '1 Minute', value: 60 },
                    { name: '5 Minute', value: 300 },
                    { name: '10 Minute', value: 600 },
                    { name: '30 Minute', value: 1800 },
                    { name: '1 Hour', value: 3600 },
                    { name: '1 Day', value: 86400 },
                    { name: '1 Week', value: 604800 }
                ).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Timeout reason').setRequired(false)),

        async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply(`You need to have 'ModerateMembers' Flag to timeout a member.`);
        }    

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const member = interaction.guild.members.fetch(user.id);
        const time = interaction.options.getInteger('time');

        if (member) {
            await member.timeout(time * 1000, reason);
            await interaction.followUp(`✅ <@${user.id}> timed out for time ${time}, for : ${reason}`);
        } else {
            await interaction.followUp('❌ User not found.');
        }
    }
};