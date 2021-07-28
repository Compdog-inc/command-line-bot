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
       message.channel.send(cmd);
       const child = spawn('ls', ['-lh'], {
           shell:true
       });
        child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

child.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
    }
});

client.login(process.env.TOKEN);
