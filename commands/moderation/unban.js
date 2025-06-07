const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban members')
        .addStringOption(option => option.setName('id').setDescription('User to be unbanned (ID)').setRequired(true)),

        async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply(`You need to have 'BanMembers' Flag to unban a member.`);
        }    

        await interaction.deferReply();

        const id = interaction.options.getUser('id');

        if (id) {
            try {
                const ban = await interaction.guild.bans.fetch(id).catch(() => null);
                    if (ban) {
                        await interaction.guild.bans.remove(id);
                        await interaction.followUp(`✅ Removed ban from ID : <@${id}> .`);
                    } else {
                        await interaction.followUp(`❌ Theres no ban for the ID : ${id}`);
                    }
            } catch (err) {
                await interaction.followUp('An error occured...');
                console.error(`[ERROR] Error in unban command : ${err}`);
            }
        }
    }
};