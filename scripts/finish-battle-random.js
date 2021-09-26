const managerCommands = require('../bot/manager-commands');

const battleId = process.env.BATTLE_ID;
const noftsIds = ['140', '26', '80', '4', '120', '176', '176', '10', '23']

const scores = noftsIds.map(noftId => ({
  noft_id: noftId,
  score: Math.round(Math.random() * 1000)
}))

managerCommands.finishBattle(process.env.BATTLE_ID, scores)
  .then(() => console.log('Battle started', 'Battle id: ', battleId))
  .catch(() => console.log('Battle started error', 'Battle id: ', battleId));
