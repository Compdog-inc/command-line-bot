const Discord = require('discord.js');
const { spawn } = require('child_process');

const mentionText = "<@!869840191362310146>";
const client = new Discord.Client();

function smartSplit(string, separator, combiner) {
    var args = string.split(separator);
    var fargs = [];
    var inArg = false;
    var startArgIndex = 0;
    for (var i = 0; i < args.length; i++) {
        if (args[i].startsWith(combiner)) {
            if (i < args.length)
                fargs.push(args[i].substr(combiner.length) + separator);
            else
                fargs.push(args[i].substr(combiner.length));
            if (args[i].endsWith(combiner)) {
                if (i < args.length)
                    fargs[i] = fargs[i].substr(0, fargs[i].length - combiner.length - separator.length);
                else
                    fargs[i] = fargs[i].substr(0, fargs[i].length - combiner.length);
            } else {
                startArgIndex = i;
                inArg = true;
            }
        } else if (args[i].endsWith(combiner)) {
            fargs[startArgIndex] += args[i].substr(0, args[i].length - combiner.length);
            inArg = false;
        } else if (inArg) {
            if (i < args.length)
                fargs[startArgIndex] += args[i] + separator;
            else
                fargs[startArgIndex] += args[i];
        } else {
            fargs.push(args[i]);
        }
    }
    return fargs;
}

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
       var fargs = smartSplit(cmd, ' ', '"');
       console.log(fargs);
       const child = spawn(fargs[0], fargs.splice(1), {
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
