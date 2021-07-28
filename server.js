const Discord = require('discord.js');

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
    if(!message.mentions.has(client.user))
      return;
  
    if (message.author == client.user)
        return;

    if (message.author.bot)
        return;
    console.log(message);
    var cmd = message.content.trimStart();
    if(cmd) {
       message.channel.send(cmd);
    }
});

client.login(process.env.TOKEN);
