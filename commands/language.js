const {MessageEmbed, Permissions} = require('discord.js');
const {i18n} = require('../i18n/i18n');
const fs = require('fs');
const path = require('path');

module.exports = {
    name:"language",
    category:"Admin",
    permissions:"MANAGE_GUILD",
    execute(message,args) {
        const guildId = message.guildId
        if(args[0]!=undefined){
            if(i18n.langs.has(args[0].toLowerCase())){
                let guilds = require('../guilds.json');
                if(guilds[guildId]==undefined){guilds[guildId]={}}
                guilds[guildId].lang = args[0];
                guilds = JSON.stringify(guilds)
                fs.writeFile(path.resolve('./','guilds.json'), guilds,(err) => {
                    if (err) throw err;
                });
                const Embed = new MessageEmbed()
                    .setDescription(i18n.t("commands.admin.language.updated",guildId,{guild:message.guild.name,language:i18n.langs.get(args[0].toLowerCase()).language}))
                    .setColor('BLUE');
                message.channel.send({embeds:[Embed]});
            }else{
                const Embed = new MessageEmbed()
                    .setDescription(i18n.t("commands.admin.language.text",guildId))
                    .setColor('BLUE')
                i18n.langs.forEach( key => {
                    Embed.description += `\n\`${key.iso}\` ${key.language}` 
                });
                message.channel.send({embeds:[Embed]});
            }
        }else{
            const Embed = new MessageEmbed()
                .setDescription(i18n.t("commands.admin.language.text",guildId))
                .setColor('BLUE')
            i18n.langs.forEach( key => {
                Embed.description += `\n\`${key.iso}\` ${key.language}` 
            });
            message.channel.send({embeds:[Embed]});
        }
    }
}