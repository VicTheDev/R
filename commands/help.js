const Discord = require('discord.js');
const maths = require('../maths');
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
const {PREFIX} = require('../config.json')
module.exports = {
	name: 'help',
	description: 'Help menus to help you find out wtf is this command for',
    category: 'Other',
	execute(message, args) {
        let categories = []
        for(const file of commandFiles){
            const command = require(`./${file}`)
            if(!categories.includes(command.category)){
                categories.push(command.category)
            }
        }
        categories = categories.filter( Boolean );
        categories.sort()
        page = 'Categories'
        if(args[0] !== undefined){
            if(categories.includes(args[0].charAt(0).toUpperCase() + args[0].slice(1))){
                page = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase()
            }
        }
        const Embed = new Discord.MessageEmbed()
            .setColor('#4172bf')
            .setTitle(`:scroll: Categories`);
        let Description = new String
        if(page === 'Categories'){
            for(const a of categories){
                Description += `• ${a}\n`
            }
            Description +='\n:information_source: Type `r2!help <category>` to get a list of commands in that category.\nExample: `r2!help fun` or `r2!help interaction`'
        }else{
            Description +=`**${page}**\n` + '```'
            for(const file of commandFiles){
                const command = require(`./${file}`)
                if(command.category === page){
                    Description += `${PREFIX}${command.name}\n`
                }
            }
            Description += '```'
            Embed  
                .setTitle(":page_with_curl: Commands List")
                .setColor("#4172bf")
                .setFooter({text: 'Type `!fact <command>` to display the help for that specific command.\nExample: `!fact snowball`'});
        }
        Embed
            .setDescription(Description);
        message.channel.send({embeds: [Embed]})
	},
};