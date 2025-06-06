const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            
            const guild = interaction.guild;
            if (!guild) throw new Error(`Can't get guild information`);
            
            const owner = guild.members.cache.get(guild.ownerId) || await guild.members.fetch(guild.ownerId).catch(() => null);
            
            const serverEmbed = new EmbedBuilder()
                .setColor(0x221b43)
                .setTitle(`Server: ${guild.name}`)
                .setThumbnail(guild.iconURL({ size: 256 }))
                .addFields(
                    { name: 'Owner', value: owner ? `${owner}` : 'Unknown', inline: true },
                    { name: 'Created', value: `<t:${Math.floor(guild.createdAt.getTime()/1000)}:R>`, inline: true },
                    { name: 'Members', value: guild.memberCount.toString(), inline: true },
                    { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
                    { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true }
                )
                .setFooter({ text: `Server ID: ${guild.id}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [serverEmbed] });
        } catch (error) {
            console.error('[ERROR] Server command error :', error);
            if (interaction.deferred) {
                await interaction.editReply('❌ Error while getting Guild Information!');
            } else {
                await interaction.reply({ 
                    content: '❌ Error while getting Guild Information!', 
                    ephemeral: true 
                });
            }
        }
    },
};