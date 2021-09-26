'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { option } = require('commander');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [

  new SlashCommandBuilder()
    .setName('auth')
    .setDescription('Chatex id')
    .addStringOption(option => option.setName('chatex_id').setDescription('Your Chatex ID').setRequired(true)),

  new SlashCommandBuilder()
    .setName('battles')
    .setDescription('Show open battles'),

  new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Show battle info')
    .addStringOption(option => option.setName('battle_id').setDescription('Battle ID').setRequired(true)),

  new SlashCommandBuilder()
    .setName('noft')
    .setDescription('Show Noft info')
    .addStringOption(option => option.setName('noft_id').setDescription('Noft ID').setRequired(true)),

  new SlashCommandBuilder()
    .setName('bet')
    .setDescription('Make bet')
    .addStringOption(option => option.setName('battle_id').setDescription('Battle ID').setRequired(true))
    .addStringOption(option => option.setName('noft_id').setDescription('Noft ID').setRequired(true))
    .addStringOption(option => option.setName('amount').setDescription('Amount of bet').setRequired(true)),

  new SlashCommandBuilder()
    .setName('my_bets')
    .setDescription('Show my bets'),
  
  new SlashCommandBuilder()
    .setName('get_prize')
    .setDescription('Get prize')
    .addStringOption(option => option.setName('bet_id').setDescription('Bet ID').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);