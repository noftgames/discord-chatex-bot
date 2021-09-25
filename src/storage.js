'use strict';

const FILENAME = __dirname + '/../storage.json';
const fs = require('fs');

/*
  BATTLE
  - id - unique id, string
  - status - string, FINISHED - известны результаты, OPEN - принимаем ставки, ONGOING - ставки закрыты
  - timestamp
  - nofts[] - массив с id нофтов
  - scores - {noft_id, score}, отсортирован по убыванию, 0 - макс, если закончен матч сюда пишем массив с очками всех нофтов
*/

/*
  NOFT
  - id
  - abilities{}
  - image_url
  - owner
  - name
  - url
  - rank
  - rating
*/

/*
  USER
  - discord_id
  - chatex_id
*/

/*
  BET
  - id
  - user_discord_id
  - coin
  - amount
  - invoice_id
  - battle_id
  - noft_id
  - status - DRAFT, PROCESSED, DONE
  - prize
*/

let storage = {
  battles: [],
  nofts: [],
  users: [],
  bets: [],
};

module.exports = {
  async load() {
    storage = require(FILENAME);
  },
  async save() {
    fs.writeFileSync(FILENAME, JSON.stringify(storage, null, 2), 'utf8');
  },

  async pushBattle(battle) {
    storage.battles = storage.battles || [];
    let found = storage.battles.find(item => item.id === battle.id);
    if (found) return;
    storage.battles.push({...battle});
    await this.save();
  },
  async updateBattle(id, battle) {
    storage.battles = storage.battles || [];
    let found = storage.battles.find(item => item.id === id);
    if (!found) { console.error(`Battle ${id} not found...`); return; }
    Object.assign(found, battle);
    await this.save();
  },
  async getBattles() {
    return [...storage.battles];
  },

  async setNofts(nofts) {
    storage.nofts = [...nofts];
    await this.save();
    return;
  },
  async getNofts() {
    return [...storage.nofts];
  },

  async addUser(discord_id) {
    storage.users = storage.users || [];
    let found = storage.find(item => item.discord_id === discord_id);
    if (found) return;
    storage.users.push({discord_id});
    await this.save();

    return {discord_id};
  },
  async updateUser(discord_id, chatex_id) {
    let found = storage.users.find(item => item.discord_id === discord_id);
    if (!found) { console.error(`User ${discord_id} not found...`); return; }
    found.chatex_id = chatex_id;
    await this.save();

    return {...found};
  },
  async getUsers() {
    return [...storage.users];
  },

  async addBet(bet) {
    storage.bets = storage.bets || [];
    storage.bets.push(bet);
    await this.save();
  },
  async updateBet(id, bet) {
    let found = storage.bets.find(item => item.id === id);
    if (!found) { console.error(`Bet ${id} not found...`); return };
    Object.assign(found, bet);
    await this.save();
    return found;
  },
  async getBets() {
    return [...storage.bets];
  }

};