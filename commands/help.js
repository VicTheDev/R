const Discord = require('discord.js');
const maths = require('../maths');
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
const {PREFIX} = require('../config.json');
const {i18n} = require('../i18n/i18n')
module.exports = {
	name: 'help',
    category: 'Utility',
    use: `\`${PREFIX}help\` - Affiche une liste de catégories de commandes\n\`${PREFIX}help <category>\` - Affiche la liste des commandes de la catégorie spécifiée\n\`${PREFIX}help <command>\` - Affiche les informations détaillées de la commande spécifiée`,
    example:`\`${PREFIX}help\`\n\`${PREFIX}help Fun\`\n\`${PREFIX}help fight\``,
	execute(message, args) {
        const guildId = message.guildId
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
            .setTitle(`:scroll: ${i18n.t("commands.utility.help.categories",guildId)}`);
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
                    .setTitle(`:page_with_curl: ${i18n.t("commands.utility.help.commandslist",guildId)}`)
                    .setColor("#4172bf")
                    .setFooter({text: i18n.t("commands.utility.help.footer",guildId,{prefix:PREFIX})});
            }else if(commandFiles.includes(args[0].toLowerCase()+'.js')){
                page = 'command'
                const command = require(`./${args[0].toLowerCase()}`)
                Embed
                    .setTitle(`${i18n.t("commands.utility.help.command",guildId)}: ${command.name.charAt(0).toUpperCase() + args[0].slice(1)}`)
                    .setColor('GREEN')
                    .addFields(
                        {name: i18n.t("commands.utility.help.uses",guildId), value: i18n.t(`commands.${command.category.toLowerCase()}.${command.name}.use`,guildId,{prefix: PREFIX})},
                        {name: i18n.t("commands.utility.help.examples",guildId), value: i18n.t(`commands.${command.category.toLowerCase()}.${command.name}.example`,guildId,{prefix: PREFIX})}
                    )
                    .setFooter({text: `${i18n.t("commands.utility.help.commandcategory",guildId)}: ${command.category}`});
                Embed.author = command.permissions ? {name:i18n.t("commands.utility.help.permissions",guildId,{permissions:command.permissions})} : {}
                Description = i18n.t(`commands.${command.category.toLowerCase()}.${command.name}.description`,guildId)
            }
        }
        if(page === 'Categories'){
            for(const a of categories){
                Description += `• ${a}\n`
            }
            Description += i18n.t("commands.utility.help.footercategories",guildId,{prefix: PREFIX})
        }
        Embed
            .setDescription(Description);
        message.channel.send({embeds: [Embed]})
	},
};