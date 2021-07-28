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
        var embed = new Discord.MessageEmbed();
        embed.setTitle(cmd);
        message.channel.send(embed).then((msg)=>{
            var proc = spawn(cmd.split(' ')[0], [cmd.split(' ').splice(1).join(' ')], {
                shell:true
            });
            
            var output = [];
        
            proc.stdout.on('data', (data) => {
                output = data.toString().match(/.{1,4000}/g);
                embed.setDescription(output[0]);
                msg.edit(embed);
            });

            proc.on('exit', (code) => {
                embed.setFooter(`Exited with code ${code}.`);
                msg.edit(embed);
            });
        });
    }
});

client.login(process.env.TOKEN);
