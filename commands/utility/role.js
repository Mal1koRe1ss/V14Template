const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Utilities for Roles')
        .addSubcommand(subcommand => subcommand
            .setName('give-to-all')
            .setDescription('Gives role to all the Members')
            .addRoleOption(option => option.setName('role').setDescription('The role that would be given to all members').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('remove-from-all')
            .setDescription('Removes role to all the Members')
            .addRoleOption(option => option.setName('role').setDescription('The role that would be taken from all members').setRequired(true))
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: "❌ You need 'Administrator' permission to use this command.",
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getRole('role');
        const guild = interaction.guild;

        const botMember = await guild.members.fetchMe();
        if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.editReply("❌ I don't have permission to manage roles!");
        }

        if (role.position >= botMember.roles.highest.position) {
            return interaction.editReply("❌ I can't manage roles higher than my highest role!");
        }

        try {
            await interaction.editReply("🔄 Fetching members, this may take a while...");
            const members = await guild.members.fetch();
            
            let processed = 0;
            let success = 0;
            const total = members.size;
            const updateInterval = Math.floor(total / 10);

            for (const member of members.values()) {
                try {
                    if (subcommand === 'give-to-all') {
                        if (!member.roles.cache.has(role.id)) {
                            await member.roles.add(role);
                            success++;
                        }
                    } else if (subcommand === 'remove-from-all') {
                        if (member.roles.cache.has(role.id)) {
                            await member.roles.remove(role);
                            success++;
                        }
                    }
                    
                    processed++;
                    
                    if (processed % updateInterval === 0 || processed === total) {
                        const percentage = Math.round((processed / total) * 100);
                        await interaction.editReply(`🔄 Processing: ${percentage}% (${processed}/${total} members)`);
                    }
                } catch (error) {
                    console.error(`Failed to modify roles for ${member.user.tag}:`, error);
                }
            }

            const action = subcommand === 'give-to-all' ? 'given to' : 'removed from';
            await interaction.editReply(`✅ Role ${role.name} has been ${action} ${success} members!`);
            
        } catch (error) {
            console.error('Role command error:', error);
            await interaction.editReply('❌ An error occurred while processing members!');
        }
    }
};