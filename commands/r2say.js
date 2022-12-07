const {SuperAdmin} = require('../config.json')
module.exports = {
    name:'r2say',
    description:'Just to say something',
    category: "Admin",
    use:"`!r2say <channelID> <message>`",
    example:"`!r2say 830814017634697216 Bonjour je suis le bot R2-D2`",
    execute(message,args){
        if(message.member.user.id==SuperAdmin){
            message.delete()
            const channelid = args.shift()
            let channel = message.guild.channels.cache.get(channelid)
            channel.send(args.join(' '))
        }
    }
}