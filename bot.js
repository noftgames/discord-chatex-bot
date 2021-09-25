const registerCommands = require('./commands');
const {Client, Intents} = require("discord.js");
const {BOT_TOKEN: token} = require("./token.json");

class Bot {
    constructor() {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS]});
        this.client.on('ready', () => console.log('Bot started!'));

        this.client.on('interactionCreate', async (interaction) => {
            console.log(JSON.stringify(interaction))
            if (!interaction.isCommand()) return;
            let response = await this.getResponse(interaction);
            await interaction.reply(response);
        });

    }

    async getResponse(interaction) {
        switch (interaction.commandName) {
            case 'make_battle':
                return this.makeBattle(interaction);
            case 'start_battle':
                return;
            case 'update_battle':
                return;
            case 'finish_battle':
                return;
            case 'add_noft':
                return;
            case 'make_battle_event':
                return;
            default:
                return 'Unknown event';
        }

    }

    makeBattle(command) {
        // console.log('AAAAA', command)
    }

    async init() {
        await registerCommands;
        return this.client.login(token);
    }
}

module.exports = {
    Bot
}