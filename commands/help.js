const Discord = require('discord.js');
const maths = require('../maths');
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
const {PREFIX} = require('../config.json')
module.exports = {
	name: 'help',
	description: 'Help you find out wtf is this command for',
    category: 'Other',
    use: '`r2!help` - Affiche une liste de catégories de commandes\n`r2!help <category>` - Affiche la liste des commandes de la catégorie spécifiée\n`!help <command>` - Affiche les informations détaillées de la commande spécifiée',
    example:"`r2!help`\n`r2!help Fun`\n`r2!help fight`",
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

        const Embed = new Discord.MessageEmbed()
            .setColor('#4172bf')
            .setTitle(`:scroll: Categories`);
        let Description = new String
        if(args[0] != undefined){
            if(categories.includes(args[0].charAt(0).toUpperCase() + args[0].slice(1))){
                page = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase()
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
                    .setFooter({text: 'Type !help <command> to display the help for that specific command.\nExample: !fact snowball'});
            }else if(commandFiles.includes(args[0].toLowerCase()+'.js')){
                page = 'command'
                const command = require(`./${args[0].toLowerCase()}`)
                Embed
                    .setTitle(`Commande ${command.name.charAt(0).toUpperCase() + args[0].slice(1)}`)
                    .setColor('GREEN')
                    .addFields(
                        {name: 'Utilisation', value:command.use},
                        {name: 'Exemples', value: command.example}
                    )
                    .setFooter({text: `Catégorie de commande : ${command.category}`});
                Description = command.description
            }
        }
        if(page === 'Categories'){
            for(const a of categories){
                Description += `• ${a}\n`
            }
            Description +='\n:information_source: Type `r2!help <category>` to get a list of commands in that category.\nExample: `r2!help fun` or `r2!help interaction`'
        }
        Embed
            .setDescription(Description);
        message.channel.send({embeds: [Embed]})
	},
};