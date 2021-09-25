'use strict';

const axios = require('axios');
const EventEmitter = require('events');

const storage = require('./storage');
const chatex = require('./chatex');
let chatexObj = null;

const events = new EventEmitter();

const api = {
  getEvents() {
    return events;
  },

  async getOpenBattles() {
    let all = await storage.getBattles();
    return all.filter(item => item.status === 'OPEN');
  },
  async getBattleById(id) {
    let all = await storage.getBattles();
    return all.find(item => item.id === id);
  },
  async createBattle(id, nofts, timestamp=Date.now(), status='OPEN', scores=[]) {
    let battleObj = {id, timestamp, status, nofts, scores};
    await storage.pushBattle(battleObj);
    events.emit('new_battle', battleObj);
    return battleObj;
  },
  async startBattle(id) {
    let found = await this.getBattleById(id);
    if (!found) { console.error(`Battle ${id} not found...`); return; }
    found.status = 'ONGOING';
    await storage.updateBattle(id, found);
    events.emit('start_battle', found);
    return found;
  },
  async finishBattle(id, scores) {
    let found = await this.getBattleById(id);
    if (!found) { console.error(`Battle ${id} not found...`); return; }
    found.status = 'FINISHED';
    found.scores = [...scores];
    await storage.updateBattle(id, found);

    let bets = (await this.getBetsByBattle(id)).filter(item => item.status === 'PROCESSED');
    let winner = scores[0].noft_id;
    let winBets = bets.filter(item => item.noft_id === winner);
    if (winBets.length === 0) {
      for (let bet of bets) bet.prize = bet.amount;
    } else {
      let total = bets.reduce((accum, curr) => accum + (+curr.amount), 0);
      let totalWin = winBets.reduce((accum, curr) => accum + (+curr.amount), 0);
      for (let bet of winBets) bet.prize = (bet.amount / totalWin) * total;
    }
    for (let bet of bets) {
      if (bet.prize === 0) bet.status = 'DONE';
      await storage.updateBet(bet.id, bet);
    }

    events.emit('finish_battle', found);
    return found;
  },
  async getBattlesByNoft(noftId) {
    let all = await storage.getBattles();
    return all.filter(item => item.nofts.filter(n => n === noftId).length);
  },

  async loadNofts() {
    let response = await axios({
      url: 'https://dev.noftgames.io/api/tokens/search',
      method: 'post',
      responseType: 'application/json',
      body: {},
    });
    let data = response.data;
    let nofts = data.map(item => ({
      id: item.tokenId,
      name: item.name,
      image_url: item.imageUrl,
      owner: item.owner,
      url: item.meta.external_url,
      rank: item.rank,
      rating: item.rating,
      abilities: item.meta.attributes.reduce((accum, curr) => {accum[curr.trait_type] = curr.value; return accum;}, {})
    }));

    await storage.addNofts(nofts);
  },
  async getNoftById(id) {
    let all = await storage.getNofts();
    return all.find(item => item.id === id);
  },

  async getUserByDiscord(id) {
    let users = await storage.getUsers();
    let found = users.find(item => item.discord_id === id);
    if (!found) { console.error(`User ${id} not found...`); return };
    return {...found};
  },
  async getUserByChatex(id) {
    let users = await storage.getUsers();
    let found = users.find(item => item.chatex_id === id);
    if (!found) { console.error(`User ${id} chatex not found...`); return };
    return {...found};
  },

  async saveChatexId(discord_id, chatex_id) {
    await storage.updateUser(discord_id, chatex_id);
  },

  async makeBet(user_discord_id, battle_id, noft_id, amount) {
    let user = await this.getUserByDiscord(user_discord_id);
    if (!user) { console.error(`User ${user_discord_id} not found...`); return };
    if (!user.chatex_id) { console.error(`Set chatex id first`); return };

    let battle = await this.getBattleById(battle_id);
    if (battle.status !== 'OPEN') { console.error(`Battle ${battle_id} doesn't open`); return }

    let noft = await this.getNoftById(noft_id);
    if (!noft) { console.error(`Noft ${noft_id} doesn't found`); return; }
    
    let id = `${user_discord_id}_${Date.now()}`;
    let invoice = await makeInvoice(user.chatex_id, 'BTC', amount);
    let bet = {
      id, user_discord_id, coin: 'BTC', amount, battle_id, noft_id, status: 'DRAFT', invoice_id: invoice.id, prize: 0
    }
    await storage.addBet(bet);

    return bet;
  },
  async getBetsByUser(discord_id) {
    let bets = await storage.getBets();
    return bets.filter(item => item.user_discord_id === discord_id);
  },
  async getBetsByBattle(battle_id) {
    let bets = await storage.getBets();
    return bets.filter(item => item.battle_id === battle_id);
  },
  async getBetsByNoft(noft_id) {
    let bets = await storage.getBets();
    return bets.filter(item => item.noft_id === noft_id);
  },
  async getBetsByStatus(status) {
    let bets = await storage.getBets();
    return bets.filter(item => item.status === status);
  },
  async getBetById(id) {
    let bets = await storage.getBets();
    return bets.find(item => item.id === id);
  },
  async getBetByInvoice(id) {
    let bets = await storage.getBets();
    return bets.find(item => item.invoice_id === id);
  },
  async onInvoiceUpdate(ivoice) {
    let bet = await this.getBetByInvoice(ivoice.id);
    let battle = await this.getBattleById(bet.battle_id);
    if (battle.status !== 'OPEN') return;
    if (ivoice.status === 'COMPLETED') {
      bet.status = 'PROCESSED';
      await storage.updateBet(bet.id, bet);
    }
  },
  async payBetPrize(bet_id) {
    let bet = await this.getBetById(bet_id);
    if (bet.status !== 'PROCESSED') return;
    if (!bet.prize) return;

    let battle = await this.getBattleById(bet.battle_id);
    if (battle.status !== 'FINISHED') return;

    let user = await this.getUserByDiscord(bet.user_id);
    bet.status = 'DONE';
    await storage.updateBet(bet_id, bet);
    await payout(user.chatex_id, 'BTC', bet.prize);
  }


};

module.exports = api;

async function makeInvoice(chatex_id, coin, amount) {
  chatexObj = chatexObj || (await chatex.auth());
  return chatexObj.makeInvoice(chatex_id, coin, amount);
}

async function payout(chatex_id, coin, amount) {
  chatexObj = chatexObj || (await chatex.auth());
  return chatexObj.payout(chatex_id, coin, amount);
}