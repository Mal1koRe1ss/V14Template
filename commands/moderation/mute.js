const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute somebody')
        .addUserOption(option => option.setName('user').setDescription('User to be muted').setRequired(true)),
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
            
               await member.voice.setMute(true);
            
            await interaction.followUp({
                content: `✅ Successfully voice muted ${user.tag}`
            });

        } catch (err) {
            console.error('[ERROR] Error wihle muting user :', err);
            await interaction.followUp({
                content: '❌ An error occurred while trying to mute the user.',
                ephemeral: true
            });
        }
    }
};