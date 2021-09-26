const axios = require('axios');

const noftsIds = ['140', '26', '80', '4', '120', '176', '176', '10', '23']
const URL = 'http://164.90.163.26:6661';
// const defaultScores = [{"noft_id": 1, "score": 1000}, {"noft_id": 2, "score": 0}, {"noft_id": 3, "score": 0}, {"noft_id": 4, "score": 0}, {"noft_id": 5, "score": 0}, {"noft_id": 6, "score": 0}, {"noft_id": 7, "score": 0}, {"noft_id": 8, "score": 0}]
const defaultScores = noftsIds.map(noft => ({noft_id: noft, score: 0}));
defaultScores[0].score = 1000;

module.exports = {
  createBattle(battleId) {
    return axios({
      url: URL,
      method: 'post',
      responseType: 'application/json',
      body: {"jsonrpc": "2.0", "method": "createBattle", "params": [battleId, noftsIds]},
    });
  },
  startBattle(battleId) {
    return axios({
      url: URL,
      method: 'post',
      responseType: 'application/json',
      body: {"jsonrpc": "2.0", "method": "startBattle", "params": [battleId]},
    });
  },
  finishBattle(battleId, scores = defaultScores) {
    return axios({
      url: URL,
      method: 'post',
      responseType: 'application/json',
      body: {"jsonrpc": "2.0", "method": "finishBattle", "params": [battleId, scores]},
    });
  }
}