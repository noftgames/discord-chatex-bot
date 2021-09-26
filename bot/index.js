'use strict';

const {Client, Intents} = require('discord.js');
const {token} = require('./config.json');
const api = require('../src/api');
const chatex = require('../src/chatex');

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const {commandName} = interaction;
  let data;

  switch (commandName) {
    case 'login':
      let ok = await chatex.checkLogin(interaction.options.getString('chatex_id'));
      if (!ok) {
        data = 'This chatex ID doesn\'t exists';
        break;
      }
      await api.saveChatexId(interaction.user.id, interaction.options.getString('chatex_id'));
      data = 'Chatex ID has been saved.'
      break;
    case 'open_battles':
      const battles = await api.getOpenBattles();
      data = battles.length ?
        battles.reduce((acc, cur) => acc + `Battle ID: ${cur.id} Status: ${cur.status} Nofts ${cur.nofts.join(' ')}\n`, '') :
        'No battles available.';
      break;
    case 'all_battles':
      const allBattles = await api.getAllBattles();
      data = allBattles.length ?
        allBattles.reduce((acc, cur) => acc + `Battle ID: ${cur.id} Status: ${cur.status} Nofts ${cur.nofts.join(' ')}\n`, '') :
        'No battles available.';
      break;
    case 'battle':
      const battle = await api.getBattleById(interaction.options.getString('battle_id'));
      if (!battle) {
        data = 'There is no match with this ID. Check the list of available matches with the /open_battles'
        break;
      }
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
        `There is no noft with this ID. Check the list of nofts with the /open_battles`
      break;
    case 'bet':
      await api.makeBet(interaction.user.id, interaction.options.getString('battle_id'), interaction.options.getString('noft_id'), interaction.options.getString('amount'))
      data = 'The bets has been sent to processing. Confirm it with Chatex'
      break;
    case 'my_bets':
      const myBets = await api.getBetsByUser(interaction.user.id);
      data = myBets.length ?
        myBets.reduce((acc, cur) => acc + `Bet ID: ${cur.id}    |    Battle: ${cur.battle_id} Noft: ${cur.noft_id} Size: ${cur.amount} BTC\n`, '') :
        "You haven't made any bets already. Make the first one with /bet";
      break;
    case 'get_prize':
      const betId = interaction.options.getString('bet_id');
      const bet = await api.getBetById(betId);
      if (!bet) {
        data = `There is no bet with this id. Check the list of your bets with /my_bets`;
        break;
      }
      const betBattle = await api.getBattleById(bet.battle_id);
      if (betBattle.status !== 'FINISHED') {
        data = 'The match is not finished yet'
        break;
      }
      if (!bet.noft_id !== betBattle.scores[0].noft_id) {
        data = 'This bet hasn’t played. Try another one with /bet'
        break;
      }
      data = await api.payBetPrize(betId);
      data = 'Congrats! Chatex notificate you, when award will be proceed'

      break;
    default:
      data = 'Command not found';
      break;
  }
  await interaction.reply(data);
});

client.login(token);

api.getEvents().on('new_battle', async battle => {
  let channel = client.channels.cache.get('891253162017693750');
  await channel.send(`⚔️ NEW BATTLE OPENED Battle ID: ${battle.id} Nofts: ${battle.nofts.join(', ')} Time: ${battle.timestamp}`);
});
api.getEvents().on('start_battle', async battle => {
  let channel = client.channels.cache.get('891253162017693750');
  await channel.send(`💥 BATTLE ${battle.id} STARTED. BETS ARE CLOSED`);
});
api.getEvents().on('finish_battle', async battle => {
  let channel = client.channels.cache.get('891253162017693750');
  await channel.send(`🏆 BATTLE ${battle.id} FINISHED. Winner: ${battle.scores[0].noft_id} Record: https://dev.noftgames.io/game`);
});
api.getEvents().on('new_bet', async bet => {
  // let channel = client.channels.cache.get('891253162017693750');
  // await channel.send(`New bet: ${JSON.stringify(bet)}`);
});
api.getEvents().on('bet_processed', async bet => {
  let channel = client.channels.cache.get('891253162017693750');
  await channel.send(`🧾 BANK GOT BET ${bet.id} for battle ${bet.battle_id}. Bet: ${bet.amount}`);
});
api.getEvents().on('bet_paid', async bet => {
  let channel = client.channels.cache.get('891253162017693750');
  await channel.send(`🤑 AWARD for battle ${bet.battle_id} HAVE BEEN PAID`);
});
