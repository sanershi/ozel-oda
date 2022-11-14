const Discord = require("discord.js");

module.exports = {
    name: "eval",
    aliases: ['e'],
  
    run: async (client, message, args) => {
    if(message.member.id !== "1012359798253174926") return
    if (!args[0]) return;
    let code = args.join(" ");

    try {
      var result = clean(await eval(code));
      if (result.includes(client.token))
        return message.channel.send("31");
      message.channel.send(`\`\`\`js\n${result}\`\`\``);
    } catch (err) {
        message.channel.send(`\`\`\`js\n${err}\`\`\``);
    }
  },
};

function clean(text) {
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 0 });
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
  return text;
}
