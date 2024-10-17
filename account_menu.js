const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
var fs = require('fs');
const config = require('./discord_config.json');

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const menu = [
    {
        id: 'change_password',
        label: 'Change Password',
    },
    {
        id: 'change_email',
        label: 'Change Email',
    },
    {
        id: 'link_account',
        label: 'Link Account',
    },
]

const credentials = [
    {
        id: 'my_password',
        label: 'My Password',
    },
    {
        id: 'my_email',
        label: 'My Email',
    },
]

client.on('ready', async () => {
    try {
     const channel = await client.channels.cache.get(config.channel_recover);
     if (!channel) return;
     const row = new ActionRowBuilder();
     const row2 = new ActionRowBuilder();
     menu.forEach((menu) => {
        row.components.push(
            new ButtonBuilder().setCustomId(menu.id).setLabel(menu.label).setStyle(ButtonStyle.Secondary)
        )
     })
     await channel.send({
        content: '# Account Menu\nBelow, you can change your password, email, and linking your account.',
        components: [row],
    });
    credentials.forEach((credentials) => {
        row2.components.push(
            new ButtonBuilder().setCustomId(credentials.id).setLabel(credentials.label).setStyle(ButtonStyle.Secondary)
        )
     })
     await channel.send({
        content: '# Account Credentials\nBelow, you can View your password, and email.',
        components: [row2],
    });
    } catch (error) {
        console.log(error);
    }
});


client.login(config.TOKEN);