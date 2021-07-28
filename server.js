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
    if (message.author == client.user)
        return;

    if (message.author.bot)
        return;

    var cmd;
    
    if(message.content.startsWith(mentionText)){
        cmd = message.content.substring(mentionText.length).trimStart();
    } else if(message.content.startsWidth('>')){
        cmd = message.content.substring(1).trimStart();
    } else return;
    
    if(cmd) {
        var embed = new Discord.MessageEmbed();
        embed.setTitle(cmd);
        message.channel.send(embed).then((msg)=>{
            var proc = spawn(cmd.split(' ')[0], [cmd.split(' ').splice(1).join(' ')], {
                shell:true
            });
            
            var output = [];
            var tmpData = "";
            var exitCode;
            var currentPage = 0;
            var leftReact;
            var rightReact;
        
            async function updateReaction(){                
                if(currentPage > 0 && !leftReact){
                    var l = await msg.react('⬅');
                    leftReact = l;
                    if(rightReact){
                        await rightReact.remove();
                        var r = await msg.react('➡');
                        rightReact = r;
                    }
                } else if(currentPage <= 0 && leftReact){
                    leftReact.remove().then(()=>leftReact = null);
                }
                
                if(currentPage < output.length - 1 && !rightReact){
                    var r = await msg.react('➡');
                    rightReact = r;
                } else if(currentPage >= output.length - 1 && rightReact){
                    rightReact.remove().then(()=>rightReact = null);
                }
            }
            
            function updateFooter(){
                if(exitCode != undefined && exitCode != null){
                       embed.setFooter(`Exited with code ${exitCode}. Page ${(currentPage+1)}/${output.length}`);
                } else {
                       embed.setFooter(`Page ${(currentPage+1)}/${output.length}`);
                }
            }
            
            var filterRight = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.member.id;
            var collectorRight = msg.createReactionCollector(filterRight);
            collectorRight.on('collect', (r,u)=>{
                if(currentPage < output.length - 1){
                    currentPage++;
                    embed.setDescription(output[currentPage]);
                    updateFooter();
                    msg.edit(embed);
                    updateReaction();
                }
                r.users.remove(u);
            });
                
            var filterLeft = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.member.id;
            var collectorLeft = msg.createReactionCollector(filterLeft);
            collectorLeft.on('collect', (r,u)=>{
                if(currentPage > 0){
                    currentPage--;
                    embed.setDescription(output[currentPage]);
                    updateFooter();
                    msg.edit(embed);
                    updateReaction();
                }
                r.users.remove(u);
            });
            
            proc.stdout.on('data', (data) => {
                tmpData += data.toString();
                output = tmpData.match(new RegExp('(.|[\r\n]){1,' + chunkSize + '}', 'g'));
                embed.setDescription(output[currentPage]);
                updateFooter();
                msg.edit(embed);
                
                updateReaction();
            });

            proc.on('exit', (code) => {
                exitCode = code;
                updateFooter();
                msg.edit(embed);
            });
        });
    }
});

client.login(process.env.TOKEN);
