'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { option } = require('commander');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [

  new SlashCommandBuilder()
    .setName('login')
    .setDescription('To get started log in with chatex')
    .addStringOption(option => option.setName('chatex_id').setDescription('Your Chatex ID').setRequired(true)),

  new SlashCommandBuilder()
    .setName('battles')
    .setDescription('Show open for betting matches'),

  new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Show info about the battle: a list of participants, the bets, results and a record of the match')
    .addStringOption(option => option.setName('battle_id').setDescription('Battle ID').setRequired(true)),

  new SlashCommandBuilder()
    .setName('noft')
    .setDescription('Show Noft info')
    .addStringOption(option => option.setName('noft_id')
      .setDescription('Show info about the noft: a card and a list of abilities determine its behavior during the battle')
      .setRequired(true)),

  new SlashCommandBuilder()
    .setName('bet')
    .setDescription('Make bet in BTC')
    .addStringOption(option => option.setName('battle_id').setDescription('Battle ID').setRequired(true))
    .addStringOption(option => option.setName('noft_id').setDescription('Noft ID').setRequired(true))
    .addStringOption(option => option.setName('amount').setDescription('Amount of bet').setRequired(true)),

  new SlashCommandBuilder()
    .setName('my_bets')
    .setDescription('Show bets you already made'),
  
  new SlashCommandBuilder()
    .setName('get_prize')
    .setDescription('Take away the rewards for the bet')
    .addStringOption(option => option.setName('bet_id').setDescription('Bet ID').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);