const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channels')
        .setDescription('Utilities for Channels')
        .addSubcommand(subcommand =>
            subcommand
                .setName('name')
                .setDescription('Change the name of the channel')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to be renamed').setRequired(true))
                .addStringOption(option => option.setName('new-name').setDescription('New  name').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cooldown')
                .setDescription('Change the Cooldown seconds of the channel')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to be edited').setRequired(true))
                .addIntegerOption(option => 
                    option.setName('seconds')
                        .setDescription('Cooldown duration (1-21600 seconds)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(21600))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user-limit')
                .setDescription('Change the User limit for the voice channel')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to be edited').setRequired(true))
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('User amonunt (0 for limitless)')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(100))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete any channel')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to be deleted').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clone')
                .setDescription('Clone any channel')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to be cloned').setRequired(true))
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply(`You need to have 'ManageChannels' Flag to use this command.`);
        }

        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel');

        try {
            if (subcommand === 'name') {
                const old_name = channel.name;
                const new_name = interaction.options.getString('new-name');

                try { 
                    await channel.setName(new_name);
                    interaction.editReply(`✅ Changed name "${old_name}" to "${new_name}"`);
                } catch (err) {
                    console.error('[ERROR] Error in channels:', err);
                    interaction.editReply('❌ An error occured while editing the channel!');
                }

            } else if (subcommand === 'cooldown') {
                const seconds = interaction.options.getInteger('seconds');
            
                try {
                    await channel.setRateLimitPerUser(seconds);
                    interaction.editReply(`✅ Set ${seconds} second cooldown for ${channel}`);
                } catch (err) {
                    console.error('[ERROR] Error in channels :', err);
                    interaction.editReply('❌ An error occured while editing the channel!');
                }
            } else if (subcommand === 'user-limit') {
                const amount = interaction.options.getInteger('amount');

                try {
                    await channel.setUserLimit(amount);
                    interaction.editReply(`✅ Set ${amount} user limit for ${channel}`);
                } catch (err) {
                    console.error(`[ERROR] Error in channels : `, err);
                    interaction.editReply('❌ An error occured while editing the channel!');
                }
            } else if (subcommand === 'delete') {
    const deleteButton = new ButtonBuilder()
        .setCustomId('delete_confirm')
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
        .setCustomId('delete_cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(deleteButton, cancelButton);

        try {
            // Butonlu mesajı gönder
            const response = await interaction.editReply({
                content: `Are you sure you want to delete <#${channel.id}>?`,
                components: [row]
            });

            // Collector oluştur (30 saniye zaman aşımı)
            const collector = response.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 30_000
            });

            collector.on('collect', async i => {
                try {
                    if (i.customId === 'delete_confirm') {
                        // Butonun devre dışı bırakılması
                        deleteButton.setDisabled(true);
                        cancelButton.setDisabled(true);
                        await i.update({
                            content: `🔄 Deleting channel <#${channel.id}>...`,
                            components: [new ActionRowBuilder().addComponents(deleteButton, cancelButton)]
                        });

                        // Kanalı sil
                        await channel.delete();
                        
                        // Kullanıcıya DM gönder
                        try {
                            await i.user.send(`✅ Deleted channel: ${channel.name} (ID: ${channel.id})`);
                        } catch (dmError) {
                            console.log(`DM gönderilemedi: ${i.user.tag}`);
                        }
                        
                        // Yanıtı güncelle (kanal silindiği için artık kanal etiketlenemez)
                        await i.editReply({
                            content: `✅ Channel deleted successfully!`,
                            components: []
                        });
                        
                    } else if (i.customId === 'delete_cancel') {
                        // İşlemi iptal et
                        deleteButton.setDisabled(true);
                        cancelButton.setDisabled(true);
                        await i.update({
                            content: '❌ Deletion cancelled.',
                            components: [new ActionRowBuilder().addComponents(deleteButton, cancelButton)]
                        });
                    }
                        } catch (error) {
                            console.error('Button interaction error:', error);
                            await i.reply({
                                content: '❌ An error occurred while processing your request!',
                                ephemeral: true
                            });
                        }
                    });

                    collector.on('end', collected => {
                        if (collected.size === 0) {
                            // Zaman aşımı durumunda butonları devre dışı bırak
                            deleteButton.setDisabled(true);
                            cancelButton.setDisabled(true);
                            response.edit({
                                content: '⏱️ Deletion request timed out.',
                                components: [new ActionRowBuilder().addComponents(deleteButton, cancelButton)]
                            }).catch(console.error);
                        }
                    });

            } catch (err) {
                console.error(`[ERROR] Error in channel deletion:`, err);
                await interaction.editReply(`❌ An error occurred while setting up deletion!`);
            }
            } else if (subcommand === 'clone') {

                try {
                    interaction.editReply(`🔄 Cloning the channel...`);
                    await channel.clone();
                    interaction.editReply(`✅ Cloned channel <#${channel.id}>`);
                } catch (err) {
                    console.error(`[ERROR] Error in channels : `, err);
                    interaction.editReply('❌ An error occured while cloning the channel!');
                }

            }
        } catch (err) {
            console.log(`[ERROR] Error in text-channels command : ${err}`);
            await interaction.editReply('❌ An error occured while editing the channel!');
        }
    },
};