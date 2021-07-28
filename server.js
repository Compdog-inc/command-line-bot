const Discord = require('discord.js');
const { spawn } = require('child_process');

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
        var proc = spawn(cmd.split(' ')[0], [cmd.split(' ').splice(1).join(' ')], {
            shell:true
        });

        var msg = message.channel.send(cmd);
        
        proc.stdout.on('data', (data) => {
            msg.edit(cmd+"\n"+data);
        });

        proc.on('exit', (code) => {
            msg.edit(msg.content+"\n"+"Exited with code "+code+".");
        });
    }
});

client.login(process.env.TOKEN);
