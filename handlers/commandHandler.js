const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '..', 'commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.error(`[ERROR] Commands directory is unavailable : ${commandsPath}`);
        return;
    }
    
    const commandCategories = fs.readdirSync(commandsPath);
    const commands = [];

    for (const category of commandCategories) {
        const categoryPath = path.join(commandsPath, category);
        if (!fs.statSync(categoryPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(categoryPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                console.log(`[INFO] Command Loaded : ${category}/${file}`);
            } else {
                console.log(`[WARNING] ${filePath} - doesn't contain "data" or "execute"!`);
            }
        }
    }

    // Registering
    const rest = new REST().setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log(`[INFO] Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
                { body: commands },
            );  

            console.log(`[INFO] Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
};