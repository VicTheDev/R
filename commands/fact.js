const Discord = require('discord.js');
const maths = require('../maths');
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
module.exports = {
	name: 'fact',
	description: 'You can find incredibles things with this command! sisi jtejure',
	execute(message, args) {
        const command = `${args[0]}.js`
        if(commandFiles.includes(command)){
            const gif = require('../LocalStorage')
            const Embed = new Discord.MessageEmbed()
                .setTitle(`Commande ${require(`./${command}`).name}`)
                .setDescription(require(`./${command}`).description)
                .setColor('effe52')
            message.channel.send({embeds : [Embed]})
        }
	}, 
};