  const express = require("express"),
  app = express(),
  ejs = require('ejs')

  const Discord = require('discord.js');
  const fs = require('fs');

  const client = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.GuildPresences,
      Discord.GatewayIntentBits.GuildMessageReactions,
      Discord.GatewayIntentBits.DirectMessages,
      Discord.GatewayIntentBits.MessageContent,
      Discord.GatewayIntentBits.GuildVoiceStates,
      Discord.GatewayIntentBits.GuildMembers
    ],
    partials: [
     Discord.Partials.Channel,s
     Discord.Partials.Message,
     Discord.Partials.User,
     Discord.Partials.GuildMember,
     Discord.Partials.Reaction
    ]
  });

const axios = require("axios");

client.on("ready", async () => {
  console.log('[BOT] Iniciado')
  await client.user.setStatus("idle");
});

app.set("view engine", "ejs");
app.use(express.static("public"))


app.use(function(req, res, next) {
  res.removeHeader("x-powered-by")
  next();
});

app.post("*", async (req, res) => {
  return res.send('nao')
});

let database = [];

if (fs.existsSync('users.json')) {
  const data = fs.readFileSync('users.json');
  database = JSON.parse(data);
}

const roleId = '1181756523895074877'; // ID DO CARGO QUE VAI TER PERMISSÃO DE ADICIONAR OS USERS NO SITE

client.on(Discord.Events.MessageCreate, async function (message) {
  if (message.author.bot) return;

  const member = message.author
  if (member && member.roles && member.roles.cache.has(roleId)) {
    return;
    }

  if (message.content.toLowerCase().startsWith('!add')) {
    const userId = message.content.split(' ')[1];

    const user = await message.client.users.fetch(userId).catch(() => null);
    if (user) {
      console.log(`Usuário encontrado: ${user.username}`);
    } else {
      message.reply(`Usuário invalido!`);
    }

    if (!database.includes(user.id)) {
      database.push(user.id);
      updateDatabase();
      message.reply(`Usuário ${user} adicionado com sucesso!`);
    } else {
      message.reply(`Usuário ${user} já está na lista!`);
    }
  }

  if (message.content.toLowerCase() === '!lista') {

    const list = new Discord.EmbedBuilder()
      .setAuthor({ name: message.guild.name + ' - Lista de Users', iconURL: message.guild.iconURL({ size: 2048 }) })
      .setDescription(`${database.map(item => `<@${item}>`).join('\n')}`)

    message.reply({ embeds: [list] });
  }
});
  
function updateDatabase() {
  fs.writeFileSync('users.json', JSON.stringify(database, null, 2), 'utf-8');
}

app.get("/", async (req, res, next) => {

   const badgeImageUrls = {
          active_developer: "https://raw.githubusercontent.com/kauexz/badges/main/svg/activedeveloper.svg",
          early_supporter: "https://raw.githubusercontent.com/mezotv/discord-badges/90629519c9f7e44096613a1e83c0a554cae49046/assets/discordearlysupporter.svg",
          premium: "https://cdn.discordapp.com/attachments/1042893855151890502/1181023597322588201/1895-subscriber-nitro-animated_1.gif?",
          hypesquad_house_3: "https://raw.githubusercontent.com/kauexz/badges/main/svg/hypesquadbalance.svg",
          hypesquad_house_2: "https://raw.githubusercontent.com/kauexz/badges/main/svg/hypesquadbrilliance.svg",
          hypesquad_house_1: "https://raw.githubusercontent.com/kauexz/badges/main/svg/hypesquadbravery.svg",
          Hypesquad: "https://raw.githubusercontent.com/kauexz/badges/main/svg/hypesquadevents.svg",
          bug_hunter_level_1: "https://raw.githubusercontent.com/kauexz/badges/main/svg/discordbughunter1.svg",
          bug_hunter_level_2: "https://raw.githubusercontent.com/kauexz/badges/main/svg/discordbughunter2.svg",
          verified_developer: "https://raw.githubusercontent.com/kauexz/badges/main/svg/discordbotdev.svg",
          certified_moderator: "https://raw.githubusercontent.com/kauexz/badges/main/svg/olddiscordmod.svg",
          staff: "https://raw.githubusercontent.com/kauexz/badges/main/svg/discordstaff.svg",
          guild_booster_lvl1: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost1.svg",
          guild_booster_lvl2: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost2.svg",
          guild_booster_lvl3: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost3.svg",
          guild_booster_lvl4: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost4.svg",
          guild_booster_lvl5: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost5.svg",
          guild_booster_lvl6: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost6.svg",
          guild_booster_lvl7: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost7.svg",
          guild_booster_lvl8: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost8.svg",
          guild_booster_lvl9: "https://raw.githubusercontent.com/kauexz/badges/main/svg/boosts/discordboost9.svg",
          legacy_username: "https://raw.githubusercontent.com/kauexz/badges/main/svg/username.png",
  };
  
  const userIds = database;
  const usersData = {};

  for (const userId of userIds) {
    const token = "TOKEN DA SUA CONTA PESSOAL"; //ADICIONA TOKEN DE UMA CONTA ALT SUA QUE ESTEJA NOS SERVIDORES QUE OS USERS DO SITE ESTEJA
    const user = await client.users.fetch(userId);
    const userR = await axios.get(`https://discord.com/api/v10/users/${userId}/profile`, {
      headers: {
        Authorization: token,
    },
    });
    const userBadges = userR.data.badges;

    usersData[userId] = {
      user,
      userR,
      userBadges,
    };
  }

  return res.render("index", {
    usersData,
    badgeImageUrls,
  });
});



client.login("TOKEN DO BOT"); // ADICIONA TOKEN DO SEU BOT E ADICIONA O BOT NO SEU SERVIDOR

app.listen(process.env.PORT || 8080, () => {
  console.log('[EXPRESS] Iniciado')
});