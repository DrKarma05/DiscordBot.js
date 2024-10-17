const { Client, IntentsBitField, EmbedBuilder , ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, Events, ActivityType } = require('discord.js');
const fs = require('fs');
const config = require('./discord_config.json');
const server_config = require('./server_config.json');
const path = require('path');
const { exec } = require('child_process');
const lineReader = require('line-reader');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const isRunning = (query, cb) => {
    const platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32':
            cmd = `tasklist`;
            break;
        case 'darwin':
            cmd = `ps -ax | grep ${query}`;
            break;
        case 'linux':
            cmd = `ps -A`;
            break;
        default:
            return cb(false);
    }

    exec(cmd, (err, stdout) => {
        if (err) {
            console.error(`Error executing command: ${err}`);
            return cb(false);
        }
        cb(stdout.toLowerCase().includes(query.toLowerCase()));
    });
};

const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
};

client.on('ready', () => {
    console.log(`${client.user.tag} bot started!`);
    
    isRunning('server.exe', (status) => {
        if (status) {
            lineReader.eachLine('online.txt', (line) => {
                const onlinePlayers = line.trim(); // Trim whitespace
                if (onlinePlayers === "0" || onlinePlayers === "1") {
                    client.user.setActivity(
                        {
                            name: `NeoTopia`,
                            type: ActivityType.Playing,
                            url: 'discord.gg/neotopia'
                        }
                    );
                } else {
                    client.user.setActivity(
                        {
                            name: `${onlinePlayers} ${server_config.server_name} Online Players`,
                            type: ActivityType.Playing,
                            url: 'discord.gg/neotopia'
                        }
                    );
                }
            });
        } else {
            client.user.setActivity(`Server Down`, { type: 'WATCHING' });
        }
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()){
        if (interaction.channel.id === config.bot_channel  && !interaction.member.roles.cache.has(config.whitelist_id)){
            if (interaction.commandName === 'ping'){
                interaction.reply('pong!');
            }
            if (interaction.commandName === 'profile') {
                const playerFilePath = `./players/link/${interaction.user.id}.json`;
            
                // Check if the account file exists
                if (!fs.existsSync(playerFilePath)) {
                    return interaction.reply({
                        content: `You don't have an account linked to your Discord.`,
                        ephemeral: true,
                    });
                }
            
                // Load player data
                const linkedData = require(playerFilePath);
                const playerGrowid = `./players/${linkedData.GrowId}_.json`;
            
                // Check if the GrowID file exists
                const myprofile = require(playerGrowid);
                const playtime = myprofile.playtime / 3600;
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`${myprofile.name} Profile`)
                    .setThumbnail(config.Tumbnail_url)
                    .setDescription(
                        `Gems: ${myprofile.gems}\n` +
                        `Level: ${myprofile.level}\n` +
                        `XP: ${myprofile.xp}\n` +
                        `OPC: ${myprofile.opc}\n` +
                        `Autofarm Far: ${myprofile.paid_far}\n` +
                        `Last Online: ${myprofile.lo}\n` +
                        `Account Playtime: ${playtime.toFixed(1)} Hours\n`
                    )
                    .setFooter({
                        text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                        iconURL: config.footer_url
                    });
            
                await interaction.reply({ embeds: [embed] });
            }
            if (interaction.commandName === 'top'){
                const worldPath = `./best_world.json`;
                const playerPath = `./best_player.json`;
                const guildPath = `./best_guild.json`;
                const world = require(worldPath);
                const player = require(playerPath);
                const guild = require(guildPath);
    
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`TOP LIST`)
                    .setThumbnail(config.Tumbnail_url)
                    .setDescription(
                        `World: ${world.world}\n` +
                        `Player: ${player.username}\n` +
                        `Guild: ${guild.guild}\n`
                    )
                    .setFooter({
                        text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                        iconURL: config.footer_url
                    });
            
                await interaction.reply({ embeds: [embed] });
            }
            if (interaction.commandName === 'host'){
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`SERVER HOST`)
                    .setThumbnail(config.Tumbnail_url)
                    .setDescription(
                        `Join our How To Play Discord to play\n` +
                        `🔗 [**Click me to Join**](https://discord.gg/eHvX3aT6mB)`
                    )
                    .setFooter({
                        text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                        iconURL: config.footer_url
                    });
            
                await interaction.reply({ embeds: [embed] });
            }
            if (interaction.commandName === 'event'){
                const gemsPath = `./server_gems_events.json`
                const xpPath = `./server_xp_events.json`
                const gems = require(gemsPath);
                const xp = require(xpPath);
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`EVENT ACTIVE`)
                    .setThumbnail(config.Tumbnail_url)
                    .setDescription(
                        `Gems event: ${gems.gems}\n` +
                        `Xp event: ${xp.xp}\n`
                    )
                    .setFooter({
                        text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                        iconURL: config.footer_url
                    });
            
                await interaction.reply({ embeds: [embed] });
            }
            if (interaction.commandName === 'status'){
                isRunning('server.exe', (status) => {
                    if (status) {
                        const embed = new EmbedBuilder()
                        .setColor('#00ff04')
                        .setTitle(`STATUS SERVER`)
                        .setThumbnail(config.Tumbnail_url)
                        .setDescription(
                            `**Server is ONLINE**`
                        )
                        .setFooter({
                            text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                            iconURL: config.footer_url
                        });
                    interaction.reply({ embeds: [embed] });
                    } else {
                        const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`STATUS SERVER`)
                        .setThumbnail(config.Tumbnail_url)
                        .setDescription(
                            `**Server is OFFLINE**`
                        )
                        .setFooter({
                            text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                            iconURL: config.footer_url
                        });
                    interaction.reply({ embeds: [embed] });
                    }
                });
            }
            if (interaction.commandName === 'help') {
                // Acknowledge the interaction to avoid timeout
                await interaction.deferReply();
    
                const embed = new EmbedBuilder()
                    .setColor('#adffff') // Ensure the color is a valid hex format
                    .setTitle(`${server_config.server_name} | Command List`)
                    .setDescription(
                        '**Some Helpful Commands List**\n' + 
                        '- /help - Shows commands list\n' + 
                        '- /status - Shows server status\n' + 
                        '- /host - Shows server host\n' +
                        '- /ping - Replies with Pong!\n' +
                        '- /event - Shows you all current events in server\n' +
                        '- /top - Shows Top Players, Worlds, and Guilds in server\n' +
                        '- /profile - Shows Your GTPS profile\n' +
                        '\n' +
                        '**Developer Commands List**\n' +
                        '- /givd - Gave items by ID to online players\n' +
                        '- /giva - Gave items by ID to players who has VIP role\n' +
                        '- /givr - Gave items by ID to Random online players\n' +
                        '- /gems - Starting Gems events\n' +
                        '- /xp - Starting XP events\n' +
                        '- /sb - send Discord sb\n' +
                        '- /gm - send Global System Message\n' +
                        '- /setreward - Create Redeem Code\n' +
                        '- /info - Shows Players account informations'
                    )
                    .setThumbnail(config.Tumbnail_url)
                    .setFooter({
                        text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                        iconURL: config.footer_url
                    });
    
                // Send the embed as a reply
                await interaction.editReply({ embeds: [embed] });
            }
        }
        if (interaction.user.id === config.user_ID) {
            if (interaction.commandName === 'database') {
                const playerPath = server_config.player;
                const worldPath = server_config.world;
                const guildPath = server_config.guild;
            
                function countJsonFiles(folder) {
                    return new Promise((resolve, reject) => {
                        fs.readdir(folder, (err, files) => {
                            if (err) {
                                return reject(`error reading the folder ${folder}: ${err}`);
                            }
            
                            const jsonFiles = files.filter(file => path.extname(file) === '.json');
                            resolve(jsonFiles.length);
                        });
                    });
                }
            
                async function countAllJsonFiles() {
                    try {
                        const playerCount = await countJsonFiles(playerPath);
                        const worldCount = await countJsonFiles(worldPath);
                        const guildCount = await countJsonFiles(guildPath);
                        
                        const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle(`Server Database`)
                        .setThumbnail(config.Tumbnail_url)
                        .setDescription(
                            `Player: ${playerCount} created\n`+
                            `World: ${worldCount} created\n`+
                            `Guild: ${guildCount} created\n`
                        )
                        .setFooter({
                            text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                            iconURL: config.footer_url
                        });
                
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    } catch (error) {
                        console.error(error);
                    }
                }
            
                countAllJsonFiles();
            }  
            if (interaction.commandName === 'sb') {
                const text = interaction.options.get('text').value;
                const data = {
                    value: text,
                };
                try {
                    // Ensure the directory exists
                    const dir = './db/claim';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
        
                    // Write data to the file
                    fs.writeFileSync(`${dir}/broadcast_discord.json`, JSON.stringify(data, null, 2));
        
                    interaction.reply({
                        content: 'SB send success.',
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error('Error writing to file:', error);
                    interaction.reply({
                        content: 'Failed to send SB. Please try again later.',
                        ephemeral: true,
                    });
                }
            }
            if (interaction.commandName === 'gm') {
                const text = interaction.options.get('text').value;
                const data = {
                    value: text,
                };
                try {
                    // Ensure the directory exists
                    const dir = './db/claim';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
        
                    // Write data to the file
                    fs.writeFileSync(`${dir}/global_discord.json`, JSON.stringify(data, null, 2));
        
                    interaction.reply({
                        content: 'GM send success.',
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error('Error writing to file:', error);
                    interaction.reply({
                        content: 'Failed to send GM. Please try again later.',
                        ephemeral: true,
                    });
                }
            }
            if (interaction.commandName === 'gems') {
                const count = interaction.options.get('count').value;
                const data = {
                    x_gems: count,
                };
                try {
                    // Ensure the directory exists
                    const dir = './db/claim';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
        
                    // Write data to the file
                    fs.writeFileSync(`${dir}/extragems_event.json`, JSON.stringify(data, null, 2));
        
                    interaction.reply({
                        content: 'Gems event started.',
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error('Error writing to file:', error);
                    interaction.reply({
                        content: 'Failed to start gems event. Please try again later.',
                        ephemeral: true,
                    });
                }
            }
            if (interaction.commandName === 'xp') {
                const count = interaction.options.get('count').value;
                const data = {
                    x_xp: count,
                };
                try {
                    // Ensure the directory exists
                    const dir = './db/claim';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
        
                    // Write data to the file
                    fs.writeFileSync(`${dir}/extraexp_event.json`, JSON.stringify(data, null, 2));
        
                    interaction.reply({
                        content: 'Xp event started.',
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error('Error writing to file:', error);
                    interaction.reply({
                        content: 'Failed to start Xp event. Please try again later.',
                        ephemeral: true,
                    });
                }
            }
            if (interaction.commandName === 'info') {
                const Player = interaction.options.get('growid').value;
                const playerFilePath = `./players/${Player}_.json`;
                if (!fs.existsSync(playerFilePath)) {
                    return interaction.reply({
                        content: `Account not found! Please check the GrowID.`,
                        ephemeral: true,
                    });
                }
                const info = require(playerFilePath);
                const playtime = info.playtime / 3600; // Convert seconds to hours
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`${info.name} Profile`)
                    .setThumbnail(config.Tumbnail_url)
                    .setDescription(
                        `**Gems:** ${info.gems}\n` +
                        `**Level:** ${info.level}\n` +
                        `**XP:** ${info.xp}\n` +
                        `**OPC:** ${info.opc}\n` +
                        `**Autofarm Far:** ${info.paid_far}\n` +
                        `**Last Online:** ${info.lo}\n` +
                        `**Account Playtime:** ${playtime.toFixed(1)} Hours\n` + // 1 decimal place
                        `**IP:** ${info.ip}\n` +
                        `**RID:** ${info.rid}\n` +
                        `**Email:** ${info.email}\n` +
                        `**Password:** ${info.pass}`
                    )
                    .setFooter({
                        text: `${server_config.server_name} Discord Bot Helper | by Karma`,
                        iconURL: config.footer_url
                    });
            
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }            
        }        
    }
    if (interaction.isButton()) {
        if (interaction.customId === 'change_password') {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('modal_password')
                .setTitle('Change Password');

            // Create text inputs
            const growid = new TextInputBuilder()
                .setCustomId('growid')
                .setLabel('GrowID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true); // Make it required if necessary

            const email = new TextInputBuilder()
                .setCustomId('email')
                .setLabel('Email')
                .setStyle(TextInputStyle.Short)
                .setRequired(true); // Make it required if necessary

            const new_pass = new TextInputBuilder()
                .setCustomId('new_pass')
                .setLabel('New Password')
                .setStyle(TextInputStyle.Short)
                .setRequired(true); // Make it required if necessary

            // Create action rows for the inputs
            const firstRow = new ActionRowBuilder().addComponents(growid);
            const secondRow = new ActionRowBuilder().addComponents(email);
            const thirdRow = new ActionRowBuilder().addComponents(new_pass);

            // Add action rows to the modal
            modal.addComponents(firstRow, secondRow, thirdRow);

            // Show the modal
            await interaction.showModal(modal);
        }
        if (interaction.customId === 'change_email') {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('modal_email')
                .setTitle('Change Email');

            // Create text inputs
            const growid = new TextInputBuilder()
                .setCustomId('growid')
                .setLabel('GrowID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true); // Make it required if necessary

            const pass = new TextInputBuilder()
                .setCustomId('pass')
                .setLabel('Password')
                .setStyle(TextInputStyle.Short)
                .setRequired(true); // Make it required if necessary

            const new_email = new TextInputBuilder()
                .setCustomId('new_email')
                .setLabel('New Email')
                .setStyle(TextInputStyle.Short)
                .setRequired(true); // Make it required if necessary

            // Create action rows for the inputs
            const firstRow = new ActionRowBuilder().addComponents(growid);
            const secondRow = new ActionRowBuilder().addComponents(pass);
            const thirdRow = new ActionRowBuilder().addComponents(new_email);

            // Add action rows to the modal
            modal.addComponents(firstRow, secondRow, thirdRow);

            // Show the modal
            await interaction.showModal(modal);
        }
        if (interaction.customId === 'link_account'){
            await interaction.reply({
                content: `comming soon..`,
                ephemeral: true,
            });
        }
        if (interaction.customId === 'my_password'){
            const playerFilePath = `./players/linked_account/${interaction.user.id}.json`;
        
            // Check if the account file exists
            if (!fs.existsSync(playerFilePath)) {
                return interaction.reply({
                    content: `You don't have an account linked to your Discord.`,
                    ephemeral: true,
                });
            }
        
            // Load player data
            const linkedData = require(playerFilePath);
            const playerGrowid = `./players/${linkedData.GrowId}_.json`;
        
            // Check if the GrowID file exists
            const myprofile = require(playerGrowid);
            await interaction.reply({
                content: `your password is ${myprofile.pass}.`,
                ephemeral: true,
            });
        }
        if (interaction.customId === 'my_email'){
            const playerFilePath = `./players/linked_account/${interaction.user.id}.json`;
        
            // Check if the account file exists
            if (!fs.existsSync(playerFilePath)) {
                return interaction.reply({
                    content: `You don't have an account linked to your Discord.`,
                    ephemeral: true,
                });
            }
        
            // Load player data
            const linkedData = require(playerFilePath);
            const playerGrowid = `./players/${linkedData.GrowId}_.json`;
        
            // Check if the GrowID file exists
            const myprofile = require(playerGrowid);
            await interaction.reply({
                content: `your email is ${myprofile.email}.`,
                ephemeral: true,
            });
        }
    }

    // Handle modal submission
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_password') {
            const growidValue = interaction.fields.getTextInputValue('growid');
            const emailValue = interaction.fields.getTextInputValue('email');
            const newPassValue = interaction.fields.getTextInputValue('new_pass');
            
            const playerFilePath = `./players/${growidValue}_.json`;
    
            // Check if the account file exists
            if (!fs.existsSync(playerFilePath)) {
                return interaction.reply({
                    content: `Account not found.`,
                    ephemeral: true,
                });
            }
    
            // Load player data
            const playerData = require(playerFilePath);
            
            // Validate the email
            if (emailValue === playerData.email) {
                playerData.pass = newPassValue;
    
                // Write the updated player data back to the file
                fs.writeFile(playerFilePath, JSON.stringify(playerData, null, pass), 'utf8', err => { // Set indentation for readability
                    if (err) {
                        return interaction.reply({
                            content: `Failed to update your password.`,
                            ephemeral: true,
                        });
                    } else {
                        return interaction.reply({
                            content: `Successfully updated your password.`,
                            ephemeral: true,
                        });
                    }
                });
            } else {
                return interaction.reply({
                    content: `Invalid email.`,
                    ephemeral: true,
                });
            }
        }
        if (interaction.customId === 'modal_email') {
            const growidValue = interaction.fields.getTextInputValue('growid');
            const newemailValue = interaction.fields.getTextInputValue('new_email');
            const PassValue = interaction.fields.getTextInputValue('pass');
            
            const playerFilePath = `./players/${growidValue}_.json`;
    
            // Check if the account file exists
            if (!fs.existsSync(playerFilePath)) {
                return interaction.reply({
                    content: `Account not found.`,
                    ephemeral: true,
                });
            }
    
            // Load player data
            const playerData = require(playerFilePath);
            
            // Validate the email
            if (PassValue === playerData.pass) {
                playerData.email = newemailValue;
    
                // Write the updated player data back to the file
                fs.writeFile(playerFilePath, JSON.stringify(playerData, null, email), 'utf8', err => { // Set indentation for readability
                    if (err) {
                        return interaction.reply({
                            content: `Failed to update your Email.`,
                            ephemeral: true,
                        });
                    } else {
                        return interaction.reply({
                            content: `Successfully updated your Email.`,
                            ephemeral: true,
                        });
                    }
                });
            } else {
                return interaction.reply({
                    content: `Invalid Password.`,
                    ephemeral: true,
                });
            }
        }
    }    
});

client.login(config.TOKEN);
