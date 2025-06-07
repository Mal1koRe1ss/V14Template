const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute somebody')
        .addUserOption(option => option.setName('user').setDescription('User to be unmuted').setRequired(true)),
        async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return interaction.reply(`You need to have 'MuteMembers' Flag to ban a member.`);
        }    

        await interaction.deferReply();

        const user = interaction.options.getUser('user');

        try {
            const member = await interaction.guild.members.fetch(user.id);

            if (!member.voice.channel) {
                return await interaction.followUp({
                    content: '❌ This user is not in a voice channel.',
                    ephemeral: true
                });
            }
            
            await member.voice.setMute(false);
            
            interaction.followUp({
                content: `✅ Successfully voice unmuted ${user.tag}`
            });

        } catch (err) {
            console.error('[ERROR] Error wihle unmuting user :', err);
            await interaction.followUp({
                content: '❌ An error occurred while trying to unmute the user.',
                ephemeral: true
            });
        }
    }
};