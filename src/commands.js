const {Routes} = require("discord-api-types/v9");
const {REST} = require("@discordjs/rest");
const {GUILD_ID, CLIENT_ID} = require("./config.js");
const {BOT_TOKEN: token} = require("../token.json");
const rest = new REST({version: '9'}).setToken(token);

const commands = [
    {
        name: 'make_battle',
        description: 'make_battle',
        options: [
            {   type: 4,
                name: 'id',
                description: 'id',
                required: true
            }
        ]
    },
    {
        name: 'update_battle',
        description: 'update_battle'
    },
    {
        name: 'start_battle',
        description: 'start_battle'
    },
    {
        name: 'add_noft',
        description: 'add_noft'
    },
    {
        name: 'finish_battle',
        description: 'finish_battle'
    },
    {
        name: 'make_battle_event',
        description: 'make_battle_event'
    }
];

const registerCommands =
    rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        {body: commands},
    );

module.exports = {
    registerCommands
}