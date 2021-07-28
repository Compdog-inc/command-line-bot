const Discord = require('discord.js');

const mentionText = "<@!869840191362310146>";
const client = new Discord.Client();

process.on('uncaughtException', function(error) {
    console.log(error);
});

process.on('unhandledRejection', function(reason, p) {
    console.log(reason);
});

client.on('ready', function() {
    console.log("Ready");
});

client.on('message', function(message) {
    if(!message.content.startsWith(mentionText))
      return;
  
    if (message.author == client.user)
        return;

    if (message.author.bot)
        return;

    var cmd = message.content.substring(mentionText.length).trimStart();
    if(cmd) {
       message.channel.send(cmd);
    }
});

client.login(process.env.TOKEN);
