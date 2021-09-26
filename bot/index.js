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
    case 'open_battles':
      const battles = await api.getOpenBattles();
      data = battles.length ?
        battles.reduce((acc, cur) => acc + `Battle ID: ${cur.id} Status: ${cur.status} Nofts ${battles.nofts.join(' ')}`) :
        'No battles available.';
      break;
    case 'battle':
      const battle = await api.getBattleById(interaction.options.getString('battle_id'));
      if (!battle) return 'There is no match with this ID. Check the list of available matches with the command /open_battles'
      const bets = await api.getBetsByBattle(battle.id);
      const sum = bets.reduce((acc, cur) => acc + cur, 0);
      data = battle.status === 'FINISHED' ?
        `${battle.id} Battle Status ${battle.status} Bets Pool: ${sum} Winner: ${battle.srores[0].noft_id} Record https://dev.noftgames.io/game` :
        `${battle.id} Battle Status ${battle.status} Bets Pool: ${sum}`;
      break;
    case 'noft':
      const id = interaction.options.getString('noft_id');
      const noft = await api.getNoftById(id);
      data = noft ?
        `Noft ${id} Abilities: (Vitality: ${noft.abilities.vitality} Vision: ${noft.abilities.vision} Power: ${noft.abilities.power} Agility: ${noft.abilities.agility} Speed: ${noft.abilities.speed}  Luck: ${noft.abilities.luck})` :
        `There is no noft with this ID. Check the list of nofts with the command /open_battles`
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