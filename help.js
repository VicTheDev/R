const Discord = require('discord.js');

function help(message,prefix){
    if(message.content === "r2" + prefix + "help"){
        const HelpEmbed = new Discord.MessageEmbed()
            .setColor('#4172bf')
            .setTitle(':scroll: Catégories de commandes')
            .setDescription('• Fun\n• Help\n• Interaction\n• Other\n\n:information_source: Tape `r2!help <catégorie>` pour obtenir la liste des commandes de cette catégorie.\nExemple: `r2!help help` ou `r2!help interaction`');
        message.channel.send(HelpEmbed)

    }

    //help fun
    if(message.content.slice(6+prefix.length).toLowerCase().trim() === 'fun'){
        const HelpFunEmbed = new Discord.MessageEmbed()
            .setColor('#4172bf')
            .setTitle(':page_with_curl: Liste des commandes')
            .setDescription('**Misc**\n```!cookie\n!otter\n!raclette\n!tardigrade\n!tartfiflette\n```');
        message.channel.send(HelpFunEmbed)

    }

    //help help
    if(message.content.slice(6+prefix.length).toLowerCase().trim() === 'help'){
        const HelpHelpEmbed = new Discord.MessageEmbed()
            .setColor('#44b584')
            .setTitle("Commande Help")
            .setDescription("Te donne les commandes que R2-D2 peut exécuter, et comment tu peux les utiliser.\n\n**Usage**\n`r2!help` - Montre une liste de catégories de commandes\n`r2!help <catégorie>` - Montre une liste de commandes dans la catégorie donnée.\n\n**Exemple**\n`r2!help interactions`,\n`r2!help fun`\n`r2!help`")
            .setFooter("Catégorie de commande: Help");
        message.channel.send(HelpHelpEmbed)

    }

    //help interaction
    if(message.content.slice(6+prefix.length).toLowerCase().trim() === 'interaction'){
        const HelpInteractionEmbed = new Discord.MessageEmbed()
            .setColor("#4172bf")
            .setTitle(":page_with_curl: Liste des commandes")
            .setDescription("**Interactions**\n```!applaud\n!banhammer\n!beton\n!bonjour\n!calin everyone\n!cry\n!deflood\n!duel\n!goodnight\n!motivation\n!piano\n!thx\n```");
        message.channel.send(HelpInteractionEmbed)
    
    }
    //help Other
    if(message.content.slice(6+prefix.length).toLowerCase().trim() === 'other'){
        const HelpInteractionEmbed = new Discord.MessageEmbed()
                .setColor("#4172bf")
                .setTitle(":page_with_curl: Liste des commandes")
                .setDescription("**Autres**\n```!info \n```");
            message.channel.send(HelpInteractionEmbed)
    }


}

module.exports = { help,};