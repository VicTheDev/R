const {MessageEmbed} = require('discord.js')
const {closestinRange} = require('../maths')
const sizes = [16, 32, 56, 64, 96, 128, 256, 300, 512, 600, 1024, 2048, 4096]
module.exports = {
    name:"avatar",
    category:"Utility",
    async execute(message,args){
        let size = 2048
        if(Number.isInteger(parseInt(args[args.length-1].replace(reg,'')))){
            size = parseInt(args[args.length-1].replace('size:',''))
            args.pop()
        }
        const members = await message.guild.members.fetch()
        const member = message.mentions.members.first() ? message.mentions.members.first() : members.find(x=> x.user.tag == args.join(' ')) ? members.find(x=> x.user.tag == args.join(' ')) : members.find(x=> x.id == args[0]) ? members.find(x=> x.id == args[0]) : message.member;
        const Embed = new MessageEmbed()
            .setTitle(member.user.username)
            .setURL(member.displayAvatarURL({dynamic:true,size:closestinRange(size,sizes)}))
            .setImage(member.displayAvatarURL({size:closestinRange(size,sizes),dynamic:true}));
        message.channel.send({embeds:[Embed]})
    }
}