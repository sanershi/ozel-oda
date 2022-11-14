const { Client, Collection } = require("discord.js");

const client = new Client({ 
    intents: [
          1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
      ]
  }); 
require('discord-modals')(client)
module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

global.logger = require("./src/structures/logger");

require("./src/handler")(client);

client.login(client.config.token);
