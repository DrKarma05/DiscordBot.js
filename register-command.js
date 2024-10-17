const config = require('./discord_config.json');
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    {
        name: 'help',
        description: 'Shows you helpful commands'
    },
    {
        name: 'status',
        description: 'Shows you server status'
    },
    {
        name: 'host',
        description: 'Shows you server host'
    },
    {
        name: 'profile',
        description: 'Shows your GTPS account profile'
    },
    {
        name: 'top',
        description: 'Shows top players, worlds, and guilds'
    },
    {
        name: 'event',
        description: 'Shows current events started in the server'
    },
    {
        name: 'sb',
        description: 'Send a Discord system message',
        options: [
            {
                name: 'text',
                description: 'The message text',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'gm',
        description: 'Send a global system message',
        options: [
            {
                name: 'text',
                description: 'The message text',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'gems',
        description: 'Start a gems event',
        options: [
            {
                name: 'count',
                description: 'The number of gems',
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'xp',
        description: 'Start an XP event',
        options: [
            {
                name: 'count',
                description: 'The amount of XP',
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'info',
        description: 'Shows player account information',
        options: [
            {
                name: 'growid',
                description: 'The GrowID of the player',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
];


const rest = new REST({ version: '10' }).setToken(config.TOKEN);

(async () => {
    try {
        console.log('Registering commands...');
        await rest.put(
            Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), 
            { body: commands }
        );
        console.log('Registration successful');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();
