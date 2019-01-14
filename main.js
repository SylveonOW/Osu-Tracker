const Discord = require("discord.js");
var $ = require("jQuery");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

var client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}...`);
})

var commands = ["addPlayer", "echo", "help", "playerInfo"];

var cmdmap = {
  addPlayer: cmd_addPlayer,
  echo: cmd_echo,
  help: cmd_help,
  playerInfo: cmd_playerInfo
}


//BEGIN OF ADD PLAYER
function cmd_addPlayer(msg, args){
  if (args.length === 1) {
    msg.channel.send("Player " + args.join(" ") + " has been added to the list");
  }else{
    msg.channel.send("Invalid argument, see parameter at ```o!t>help addPlayer```")
  }
}

function cmd_echo(msg, args){
    msg.channel.send(args.join(" "));
    console.log()
}
//END OF ADD PLAYER

//Begin of HELP
function cmd_help(msg, args){
  if (args.length === 1) {

    var arg = args[0];
    if (arg == "list") {
      var message = "Following commands are implemented by version 1.0.0dev ";

      message += "```"
      commands.sort();
      for (var i = 0; i < commands.length; i++) {
        if (i < commands.length - 1) {
          message += commands[i] + " , ";
        }else{
          message += commands[i];
        }
      }
      message += "```";
      msg.channel.send(message);
    }

    if (arg == "addPlayer" || arg == "addplayer") {
      var message = "Manual to use " + arg + " : ```o!t>" + arg +" [name]```";
      msg.channel.send(message);
    }

  }else if (args.length === 0){
    var message = "Manual to use Help :  \n";
    message += "To use the help command, type in the command like shown below. Commands are Casesensitive "
    message += "```o!t>help [command]```";
    msg.channel.send(message);
  }
}
//END OF HELP


//  GET PLAYER INFORMATION
  function cmd_playerInfo(msg, args){
    if (args.length === 1) {
      var arg = args.join(" ");
      $.getJSON("https://osu.ppy.sh/api/get_user" , {"k" : config.apikey , "u" : arg}, function(data){
        console.log(data);
      })
    }
  }
//END OF GET PLAYER INFORMATION


client.on("message", (msg) => {
  var cont = msg.content,
    author = msg.member,
    chan = msg.channel,
    guild = msg.guild

    if(author.id != client.user.id && cont.startsWith(config.prefix)){
      // o!t> say hello world
      var invoke = cont.split(" ")[0].substr(config.prefix.length);
        args = cont.split(" ").slice(1);

        if (invoke in cmdmap) {
          cmdmap[invoke](msg, args);
        }


    }
})

client.login(config.token);
