require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] }); // Added GUILD_MESSAGE_REACTIONS intent

let images = require('./rupert.json').images;
let currentIndex = 0;
const channelCooldowns = {};
const serverCooldowns = {};
const cooldownEmotes = [
    '1158799845826498660', // JoyRupert
    '1158800118745665616', // NapRupert
    '1158799535716446288', // ScreamingRupert
    '1158799858279399574', // UpsideDownRupert
    '1158799865577492641', // WiseRupert
    '1158800023392362647' // aMimirRupert
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle multiple times because why not :)
shuffleArray(images);
shuffleArray(images);
shuffleArray(images);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async msg => { 
    if (msg.author.bot) return;

    const channelID = msg.channel.id;
    const serverID = msg.guild.id;

    if (checkIfRupert(msg.content) || msg.mentions.has(client.user.id)) {
        if (isOnCooldown(channelID, channelCooldowns, 2) || isOnCooldown(serverID, serverCooldowns, 5)) {
            console.log("Cooldown activated");
            const emoteID = cooldownEmotes[Math.floor(Math.random() * cooldownEmotes.length)];
            await msg.react(emoteID);
            return;
        }

        const currentTime = new Date().getTime();
        console.log(`Rupert mentioned at ${new Date(currentTime).toLocaleString()} GMT+1 in server ${serverID}, channel ${channelID}: ${msg.content}`);
        
        msg.channel.send(images[currentIndex]);
        currentIndex++;
        if (currentIndex >= images.length) {
            shuffleArray(images);
            currentIndex = 0;
        }

        if (!channelCooldowns[channelID]) {
            channelCooldowns[channelID] = [];
        }
        channelCooldowns[channelID].push(currentTime);

        if (!serverCooldowns[serverID]) {
            serverCooldowns[serverID] = [];
        }
        serverCooldowns[serverID].push(currentTime);
    }
});

function isOnCooldown(id, cooldowns, limit) {
    const currentTime = new Date().getTime();

    if (!cooldowns[id]) {
        cooldowns[id] = [];
        return false;
    }

    cooldowns[id] = cooldowns[id].filter(timestamp => currentTime - timestamp < 60000);

    return cooldowns[id].length >= limit;
}

function checkIfRupert(message) {
    const cleanedMessage = message.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleanedMessage.split(' ');
    return words.includes('rupert');
}

client.login(process.env.DISCORD_BOT_TOKEN);
