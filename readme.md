# Discord Bot Template (V14)

A robust, production-ready Discord bot template built with Discord.js v14 featuring modular command and event handlers, automatic registration, and comprehensive error handling.

![Discord.js Version](https://img.shields.io/badge/discord.js-v14-blue?logo=npm)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0-green?logo=node.js)

## Features

- 🧩 **Modular Architecture**: Commands and events organized in categorized subdirectories
- ⚡ **Automatic Registration**: Commands auto-register on bot startup
- 🔍 **Recursive Loading**: Supports unlimited subdirectories for organization
- 📝 **Comprehensive Logging**: Detailed console output for debugging
- 🛡️ **Error Handling**: Graceful error recovery and reporting
- ⚙️ **Configuration**: Simple .env based configuration
- 📊 **Server Info Command**: Built-in server information display

## Prerequisites

- Node.js v16.9 or higher
- Discord bot token ([create one here](https://discord.com/developers/applications))
- Basic JavaScript knowledge

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mal1kore1ss/V14Template.git
cd V14Template
```

2. **Install dependencies**
```bash
npm i
```

3. **Edit the .env file**
```env
TOKEN=your_bot_token_here
APPLICATION_ID=your_application_id_here
GUILD_ID=your_development_server_id_here
```

4. **Enable Privileged Intents**
- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Select your application
- Navigate to "Bot" → "Privileged Gateway Intents"
- Enable **SERVER MEMBERS INTENT** and **MESSAGE CONTENT INTENT**

## Project Structure

```
├── commands/              # Command modules
│   ├── category1/         # Command categories
│   │   └── command.js     # Individual commands
│   └── category2/
│       └── command.js
├── events/                # Event handlers
│   ├── core/              # Organized by category
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   └── moderation/
│       └── messageDelete.js
├── handlers/              # Core handlers
│   ├── commandHandler.js  # Command loader
│   └── eventHandler.js    # Event loader
├── .env                   # Environment configuration
├── main.js                # Main entry point
└── package.json           # Dependencies
```

## Adding Commands

1. Create a new file in `commands/<category>/commandName.js`
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  
  async execute(interaction) {
    await interaction.reply('Pong!');
  }
};
```

2. Restart your bot - the command will auto-register

## Adding Events

1. Create a new file in `events/<category>/eventName.js`
```javascript
module.exports = {
  name: 'messageCreate',  // Discord event name
  once: false,            // Set true for one-time events
  async execute(client, message) {
    if (message.content === 'hello') {
      message.reply('Hello there!');
    }
  }
};
```

2. Restart your bot - the event will be automatically loaded

## Running the Bot

```bash
node main.js
```

## Customization

### Environment Variables
- `TOKEN`: Your Discord bot token
- `APPLICATION_ID`: Your Discord application ID
- `GUILD_ID`: Development server ID for faster command registration

### Command Categories
Organize commands by creating new directories in the `commands` folder:
```
commands/
├── moderation/
├── utility/
├── fun/
└── admin/
```

### Event Categories
Organize events similarly:
```
events/
├── core/
├── moderation/
├── errors/
└── logging/
```

## Troubleshooting

**Problem**: "The application did not respond"  
**Solution**: Ensure all async commands use `await` properly

**Problem**: Commands not appearing  
**Solution**: 
1. Verify correct intents in Developer Portal
2. Check `.env` variables are correct

**Problem**: Event not triggering  
**Solution**:
1. Verify event name matches Discord's event names
2. Check console for loading errors
3. Ensure event file exports `name` and `execute` properties

## License

This project is licensed under the APACHE License - see the [LICENSE](LICENSE) file for details.

## Support

For support or feature requests:
- [Create an issue](https://github.com/Mal1kore1ss/V14Template/issues)
- Join my [Discord Support Server](https://discord.gg/DUxFWjqQRD)