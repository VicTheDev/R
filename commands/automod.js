const { MessageEmbed, Permissions } = require('discord.js')
const { i18n } = require('../i18n/i18n')
const { PREFIX } = require('../config.json')
const fs = require('fs');
const path = require('path');
const {removeItem} = require('../maths')
module.exports = {
    name: "automod",
    category: "Admin",
    permissions:"ADMINISTRATOR",
    execute(message, args) {
        const guildId = message.guildId
        let guilds = require('../guilds.json');
        const Embed = new MessageEmbed()
            .setColor('DARK_GREEN');
        switch (args[0]) {
            case 'usernames':
                switch (args[1]) {
                    case 'on':
                        if (guilds[guildId] == undefined) { guilds[guildId] = {} }
                        if (guilds[guildId].mod == undefined) { guilds[guildId].mod = {} }
                        if (!guilds[guildId].mod.usernames) {
                            guilds[guildId].mod.usernames = true;
                            guilds = JSON.stringify(guilds)
                            fs.writeFile(path.resolve('./', 'guilds.json'), guilds, (err) => {
                                if (err) throw err;
                            });
                        }
                        Embed
                            .setDescription(i18n.t("commands.admin.automod.usernames.on", guildId, { prefix: PREFIX }))
                            .setColor('GREEN')
                        break;
                    case 'off':
                        if (guilds[guildId] == undefined) { guilds[guildId] = {} }
                        if (guilds[guildId].mod == undefined) { guilds[guildId].mod = {} }
                        if (guilds[guildId].mod.usernames) {
                            guilds[guildId].mod.usernames = false;
                            guilds = JSON.stringify(guilds)
                            fs.writeFile(path.resolve('./', 'guilds.json'), guilds, (err) => {
                                if (err) throw err;
                            });
                        }
                        Embed
                            .setDescription(i18n.t("commands.admin.automod.usernames.off", guildId, { prefix: PREFIX }))
                            .setColor('DARK_RED')
                        break;
                    default:
                        const status = guilds[guildId] == undefined ? 'disabled' : guilds[guildId].mod == undefined ? 'disabled' : guilds[guildId].mod.messages == undefined ? 'disabled' : guilds[guildId].mod.messages ? 'enabled' : 'disabled';
                        Embed
                            .setTitle(i18n.t("commands.admin.automod.usernames.default.title", guildId))
                            .setDescription(i18n.t("commands.admin.automod.usernames.default.description", guildId))
                            .addFields(
                                { name: i18n.t("commands.admin.automod.usernames.default.fields.options", guildId), value: i18n.t("commands.admin.automod.usernames.default.fields.text", guildId), inline: true },
                                { name: i18n.t("commands.admin.automod.usernames.default.fields.status", guildId), value: i18n.t(`commands.admin.automod.usernames.default.fields.${status}`, guildId), inline: true }
                            )
                        break;
                }
                message.channel.send({ embeds: [Embed] })
                break;
            case 'messages':
                switch (args[1]) {
                    case 'on':
                        if (guilds[guildId] == undefined) { guilds[guildId] = {} }
                        if (guilds[guildId].mod == undefined) { guilds[guildId].mod = {} }
                        if (!guilds[guildId].mod.messages) {
                            guilds[guildId].mod.messages = true;
                            guilds = JSON.stringify(guilds)
                            fs.writeFile(path.resolve('./', 'guilds.json'), guilds, (err) => {
                                if (err) throw err;
                            });
                        }
                        Embed
                            .setDescription(i18n.t("commands.admin.automod.messages.on", guildId, { prefix: PREFIX }))
                            .setColor('GREEN')
                        break;
                    case 'off':
                        if (guilds[guildId] == undefined) { guilds[guildId] = {} }
                        if (guilds[guildId].mod == undefined) { guilds[guildId].mod = {} }
                        if (guilds[guildId].mod.messages) {
                            guilds[guildId].mod.messages = false;
                            guilds = JSON.stringify(guilds)
                            fs.writeFile(path.resolve('./', 'guilds.json'), guilds, (err) => {
                                if (err) throw err;
                            });
                        }
                        Embed
                            .setDescription(i18n.t("commands.admin.automod.messages.off", guildId, { prefix: PREFIX }))
                            .setColor('DARK_RED')
                        break;
                    default:
                        const status = guilds[guildId] == undefined ? 'disabled' : guilds[guildId].mod == undefined ? 'disabled' : guilds[guildId].mod.messages == undefined ? 'disabled' : guilds[guildId].mod.messages ? 'enabled' : 'disabled';
                        Embed
                            .setTitle(i18n.t("commands.admin.automod.messages.default.title", guildId))
                            .setDescription(i18n.t("commands.admin.automod.messages.default.description", guildId))
                            .addFields(
                                { name: i18n.t("commands.admin.automod.messages.default.fields.options", guildId), value: i18n.t("commands.admin.automod.messages.default.fields.text", guildId), inline: true },
                                { name: i18n.t("commands.admin.automod.messages.default.fields.status", guildId), value: i18n.t(`commands.admin.automod.messages.default.fields.${status}`, guildId), inline: true }
                            )
                        break;
                }
                message.channel.send({ embeds: [Embed] })
                break;
            case 'banwords':
                switch (args[1]){
                    case 'list':
                        Embed.setTitle(i18n.t("commands.admin.automod.banwords.list.title",guildId))
                            .setDescription('\n```\n'+guilds?.[guildId]?.mod?.banwords?.join(`\n`)+' \n```')
                            .setFooter({text:message.guild.name})
                        message.channel.send({embeds:[Embed]})
                        break;
                    case 'add' :
                        if(args.length>=3){
                            args = args.slice(2)
                            if (guilds[guildId] == undefined) { guilds[guildId] = {} }
                            if (guilds[guildId].mod == undefined) { guilds[guildId].mod = {} }
                            if (guilds[guildId].mod.banwords == undefined) {guilds[guildId].mod.banwords == []}
                            const words = [];
                            for (let word of args) {
                                if (!guilds[guildId].mod.banwords.includes(word)){
                                    guilds[guildId].mod.banwords.push(word)
                                    words.push(word)
                                }
                            }
                            if(words.length>0){
                                guilds = JSON.stringify(guilds)
                                fs.writeFile(path.resolve('./', 'guilds.json'), guilds, (err) => {
                                    if (err) throw err;
                                });
                                Embed
                                    .setDescription(i18n.t(`commands.admin.automod.banwords.add.added${words.length==1 ? '' : 'many'}`,guildId,{word:words.join(', ')}))
                                    .setColor('GREEN');
                            }else{
                                Embed
                                .setDescription(i18n.t("commands.admin.automod.banwords.noarg",guildId))
                                .setColor('RED');
                            }
                        }else{
                            Embed
                                .setDescription(i18n.t("commands.admin.automod.banwords.noarg",guildId))
                                .setColor('RED');
                        }
                        message.channel.send({embeds:[Embed]})
                        break;
                    case 'remove' :
                        if(args.length>=3){
                            args = args.slice(2)
                            const words = [];
                            for (let word of args) {
                                if (guilds[guildId]?.mod?.banwords.includes(word)){
                                    guilds[guildId].mod.banwords = removeItem(guilds[guildId].mod.banwords,word)
                                    words.push(word)
                                }
                            }
                            if(words.length>0){
                                guilds = JSON.stringify(guilds)
                                fs.writeFile(path.resolve('./', 'guilds.json'), guilds, (err) => {
                                    if (err) throw err;
                                });
                                Embed
                                    .setDescription(i18n.t(`commands.admin.automod.banwords.remove.removed${words.length==1 ? '' : 'many'}`,guildId,{word:words.join(', ')}))
                                    .setColor('ORANGE');
                                message.channel.send({embeds:[Embed]})
                            }else{
                                Embed
                                    .setDescription(i18n.t("commands.admin.automod.banwords.noarg",guildId))
                                    .setColor('RED');
                            }
                        }else{
                            Embed
                                .setDescription(i18n.t("commands.admin.automod.banwords.noarg",guildId))
                                .setColor('RED');
                        }
                        message.channel.send({embeds:[Embed]})
                        break;
                    default:
                        Embed
                            .setTitle(i18n.t("commands.admin.automod.banwords.default.title",guildId))
                            .setDescription(i18n.t("commands.admin.automod.banwords.default.description",guildId));
                        message.channel.send({embeds:[Embed]})
                        break;
                }
                break;
            default:
                Embed
                    .setTitle(i18n.t("commands.admin.automod.default.title", guildId))
                    .setDescription(i18n.t("commands.admin.automod.default.description", guildId))
                    .setFooter({ text: i18n.t("commands.admin.automod.default.footer", guildId, { prefix: PREFIX }) })
                message.channel.send({ embeds: [Embed] })
                break;
        }
    }
}