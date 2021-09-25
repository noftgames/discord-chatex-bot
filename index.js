const {Bot} = require('./bot');

const run = () => {
    const bot = new Bot();
    return bot.init();
}

run().then()