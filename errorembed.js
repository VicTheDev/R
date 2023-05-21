const {MessageEmbed} = require('discord.js')
const {i18n} = require('./i18n/i18n')
const {capitalizeFirstLetter} = require('./maths')
const {PREFIX} = require('./config.json')

function ErrorEmbed(object,guildId){
    const Embed = new MessageEmbed()
        .setColor("#ef5350")
        .setTitle(`${i18n.t("commands.utility.help.command",guildId)}: ${capitalizeFirstLetter(object.name)}`)
        .setDescription(`${i18n.t("commands.interaction.mentionmissing",guildId)}\n\nUsage\n${i18n.t(`commands.${object.category.toLowerCase()}.${object.name}.use`,guildId,{prefix:PREFIX})}\n\nExamples\n${i18n.t(`commands.${object.category.toLowerCase()}.${object.name}.example`,guildId,{prefix:PREFIX})}`)
        .setFooter({text: `${i18n.t("commands.utility.help.commandcategory",guildId)}: ${object.category}`});
    return Embed;
}
function missingPermission(permission,guildId){
    const Embed = new MessageEmbed()
        .setColor("#ef5350")
        .setDescription(i18n.t("commands.utility.missingpermission",guildId,{permission:permission}));
    return Embed;
}
module.exports = {ErrorEmbed, missingPermission}