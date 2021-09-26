const managerCommands = require('../bot/manager-commands');

const battleId = process.env.BATTLE_ID;
managerCommands.startBattle(process.env.BATTLE_ID)
  .then(() => console.log('Battle started', 'Battle id: ', battleId))
  .catch(() => console.log('Battle started error', 'Battle id: ', battleId));
