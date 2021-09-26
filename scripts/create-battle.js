const managerCommands = require('../bot/manager-commands');

const battleId = (new Date().getTime()).toString();
managerCommands.createBattle(battleId)
  .then(() => console.log('Battle created', 'Battle id: ', battleId))
  .catch(() => console.log('Battle create error', 'Battle id: ', battleId));
