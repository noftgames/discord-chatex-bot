'use strict';

const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const api = require('../src/api');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
  let data;

  switch (commandName) {
    case 'login':
      await api.saveChatexId(interaction.user.id, interaction.options.getString('chatex_id'));
      data = 'Chatex ID has been saved.'
      break;
    case 'battles':
      const battles = await api.getOpenBattles();
      data = battles.length ?
        battles.reduce((cur, acc) => acc + `Battle ID: ${cur.id} Status: ${cur.status}`, '') :
        'No battles available.';
      break;
    case 'battle':
      data = await api.getBattleById(interaction.options.getString('battle_id'));
      break;
    case 'noft':
      data = await api.getNoftById(interaction.options.getString('noft_id'));
      break;
    case 'bet':
      data = await api.makeBet(interaction.user.id, interaction.options.getString('battle_id'), interaction.options.getString('noft_id'), interaction.options.getString('amount'))
      break;
    case 'my_bets':
      data = await api.getBetsByUser(interaction.user.id);
      break;
    case 'get_prize':
      data = await api.payBetPrize(interaction.options.getString('bet_id'));
      break;
    default:
      data = 'Command not found';
      break;
  }
  await interaction.reply(JSON.stringify(data || {}, null, 2));

	// if (commandName === 'ping') {
	// 	await interaction.reply('Pong!');
	// } else if (commandName === 'server') {
	// 	await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	// } else if (commandName === 'user') {
	// 	await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	// } else if (commandName === 'gif') {
  //   console.log(interaction.options.getString('category'));
  //   await interaction.reply('ok-ok');
  // }
});

client.login(token);