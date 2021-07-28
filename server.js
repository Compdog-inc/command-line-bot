const Discord = require('discord.js');
const { spawn } = require('child_process');

const chunkSize = 4000;
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
            var currentPage = 0;
            var leftReact;
            var rightReact;
        
            function updateReaction(){
                if(currentPage < output.length - 1 && !rightReact){
                    msg.react('➡').then(r=>rightReact = r);
                } else if(rightReact){
                    rightReact.remove().then(()=>rightReact = null);
                }
                
                if(currentPage > 0 && !leftReact){
                    msg.react('⬅').then(r=>leftReact = r);
                } else if(leftReact){
                    leftReact.remove().then(()=>leftReact = null);
                }
            }
            
            proc.stdout.on('data', (data) => {
                output = data.toString().match(new RegExp('(.|[\r\n]){1,' + chunkSize + '}', 'g'));
                embed.setDescription(output[currentPage]);
                msg.edit(embed);
                
                if(currentPage < output.length - 1){
                    msg.react('➡').then(r=>rightReact = r);
                    var filterRight = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.member.id;
                    var collectorRight = msg.createReactionCollector(filterRight);
                    collectorRight.on('collect', (r,u)=>{
                        if(currentPage < output.length - 1){
                            currentPage++;
                            embed.setDescription(output[currentPage]);
                            msg.edit(embed);
                            updateReaction();
                        }
                        r.users.remove(u);
                    });
                }
                
                if(currentPage > 0){
                    msg.react('⬅').then(r=>leftReact = r);
                    var filterLeft = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.member.id;
                    var collectorLeft = msg.createReactionCollector(filterLeft);
                    collectorLeft.on('collect', (r,u)=>{
                        if(currentPage > 0){
                            currentPage--;
                            embed.setDescription(output[currentPage]);
                            msg.edit(embed);
                            updateReaction();
                        }
                        r.users.remove(u);
                    });
                }
            });

            proc.on('exit', (code) => {
                embed.setFooter(`Exited with code ${code}.`);
                msg.edit(embed);
            });
        });
    }
});

client.login(process.env.TOKEN);
