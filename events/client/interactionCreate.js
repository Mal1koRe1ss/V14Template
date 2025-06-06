module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;
        
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Command Error : ${interaction.commandName}`, error);
            await interaction.reply({
                content: 'Error while running command!',
                ephemeral: true
            });
        }
    }
};