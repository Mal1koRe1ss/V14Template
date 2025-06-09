const { SlashCommandBuilder, EmbedBuilder, GuildChannel, PermissionsBitField, User } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about the server/channels/roles.')
        .addSubcommand(subcommand => subcommand
                .setName('server')
                .setDescription('Provides information about the server.')
        )
        .addSubcommand(subcommand => subcommand
                .setName('channel')
                .setDescription('Provides information about the server.')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to be given information about').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
                .setName('role')
                .setDescription('Provides information about the server.')
                .addRoleOption(option => option.setName('role').setDescription('The role to be given information about').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Provides information about the selected user')
            .addUserOption(option => option.setName('user').setDescription('The user to be given information aobut').setRequired(true))
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            
            const subcommand = interaction.options.getSubcommand();
            const channel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role');
            const user = interaction.options.getUser('user');
            const guild = interaction.guild;

            if (!guild) throw new Error(`Can't get guild information`);
            
            try {
                if (subcommand === 'server') {
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
            } else if (subcommand === 'channel') {
                const channelEmbed = new EmbedBuilder()
                .setColor(0x221b43)
                .setTitle(`Channel: ${channel.name}`)
                .setThumbnail(guild.iconURL({ size: 256 }))
                .addFields(
                    { name: 'Created', value: `<t:${Math.floor(channel.createdAt.getTime()/1000)}:R>`, inline: true },
                    { name: 'Parent', value: !channel.parent ? "None" : channel.parent.name, inline: true },
                    { name: 'Voice Based ?', value: channel.isVoiceBased() ? "Yes" : "No", inline: true },
                    { name: 'Text Based ?', value: channel.isTextBased() ? "Yes" : "No", inline: true },
                    { name: 'Thread ?', value: channel.isThread() ? "Yes" : "No", inline: true}
                )
                .setFooter({ text: `Channel ID: ${channel.id}` })
                .setTimestamp();

                await interaction.editReply({ embeds: [channelEmbed] });
            } else if (subcommand === 'role') {
                const permissions = role.permissions.toArray().join(', ') || 'No permissions';
                const roleEmbed = new EmbedBuilder()
                .setColor(role.color)
                .setTitle(`Role: ${role.name}`)
                .setThumbnail(guild.iconURL({ size: 256 }))
                .addFields(
                    { name: 'Created', value: `<t:${Math.floor(role.createdAt.getTime()/1000)}:R>`, inline: true },
                    { name: 'Color', value: role.hexColor, inline: true },
                    { name: 'Mentionable ?', value: role.mentionable ? "Yes" : "No", inline: true },
                    { name: 'Permissions', value: permissions.length > 1024 ? "Too many permissions to display" : permissions, inline: false },
                )
                .setFooter({ text: `Role ID: ${role.id}` })
                .setTimestamp();

                await interaction.editReply({ embeds: [roleEmbed] });
            } else if (subcommand === 'user') {

                const userEmbed = new EmbedBuilder()
                .setColor(0x221b43)
                .setTitle(`User: ${user.username}`)
                .setThumbnail(user.avatarURL({ size: 256 }))
                .addFields(
                    { name: 'Created', value: `<t:${Math.floor(user.createdAt.getTime()/1000)}:R>`, inline: true },
                    { name: 'Display Name', value: user.displayName, inline: true },
                    { name: 'Username', value: user.username, inline: true }
                )
                .setFooter({ text: `User ID: ${user.id}` })
                .setTimestamp();

                await interaction.editReply({ embeds: [userEmbed] });
            }
                } catch (err) {
                    console.error(`[ERROR] Error in information command : `, err);
                    await interaction.editReply('❌ An error occured!');;
                }
        } catch (err) {
            console.error('[ERROR] Error in information command error :', err);
        }
    },
};