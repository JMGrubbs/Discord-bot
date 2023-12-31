// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require("discord.js");
const { naeblis_discord_bot } = require("../config.json");
const TOKEN = naeblis_discord_bot["token"];
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    console.log(command);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.application.commands.create(command.data);
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}
// console.log(client.commands);

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction);
  if (!interaction.isChatInputCommand()) return;
  console.log("HIT");
  // const command = interaction.client.commands.get(interaction.commandName);
  // if (!command) {
  //   console.error(`No command matching ${interaction.commandName} was found.`);
  //   return;
  // }

  // try {
  //   await command.execute(interaction);
  // } catch (error) {
  //   console.error(error);
  //   if (interaction.replied || interaction.deferred) {
  //     await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
  //   } else {
  //     await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  //   }
  // }
});
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client.user.setActivity("BOOM SMACK");
});

// Log in to Discord with your client's token
client.login(TOKEN);
