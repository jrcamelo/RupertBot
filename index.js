require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const images = require('./rupert.json').images;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    if (msg.author.bot) return;

    if (checkIfRupert(msg.content) || msg.mentions.has(client.user.id)) {
        const currentTime = new Date().toLocaleString();
        const serverID = msg.guild.id;
        const channelID = msg.channel.id; 
        console.log(`Rupert mentioned at ${currentTime} GMT+1 in server ${serverID}, channel ${channelID}: ${msg.content}`);
        
        const randomImage = images[Math.floor(Math.random() * images.length)];
        msg.channel.send(randomImage);
    }
});

function checkIfRupert(message) {
    const cleanedMessage = message.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleanedMessage.split(' ');
    return words.includes('rupert');
}

client.login(process.env.DISCORD_BOT_TOKEN);
