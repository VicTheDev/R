const { MessageEmbed, Message } = require('discord.js');
const {Inventory, Profile} = require('../database/mongoose')
const {getRandomInt, getPercentage, capitalizeFirstLetter} = require('../maths')

module.exports = {
    name: "flip",
    description: "50% chances of winning your bet",
    category: "Inventory",
    use: "`!flip <bet> <choice>` - Your choice must be `heads` or `tails`, if the coin falls on the right side, you win the bet you made, otherwise you lose it",
    example: "`!flip 50 heads` - If the coin falls on heads, you win 50 coin.\n`!flip 40.5 tails` - If the coin falls on heads, you lose 40.5 coins.",
    async execute(message,args){
        let bet = parseFloat(args[0]);
        const choice = args[1].toLowerCase();
        const user = message.author;
        if(isNaN(bet)||bet<=0){
            const replymes = await message.reply({content:"Your bet is not valid! It must be a decimal value larger than 0."});
            setTimeout(() => {
                try {
                    replymes.delete()
                  } catch (error) {
                    console.error('Message was deleted');
                  }
            }, 3000);
            return;
        }
        if(!["heads","tails"].includes(choice)){
            const replymes = await message.reply({content:"Your choice is not valid! It must `heads` or `tails`"})
            setTimeout(() => {
                try {
                    replymes.delete()
                  } catch (error) {
                    console.error('Message was deleted');
                  }
            }, 3000);
            return;
        }
        getInventory(message,user,bet,choice)
    }
}
function getInventory(message,user,bet,choice){
    Inventory.exists({ user: user.id }, async function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (doc === false) {
                let element = await Inventory.create({
                    user: user.id,
                    inventory: [],
                    money: 0,
                    daily: Date.now()
                });
                await element.save();
                element = element.toObject();
                console.log('Inventory created');
                flipthecoin(message,user,bet,choice,element);
            }
            if (doc === true) {
                let element = await Inventory.findOne({ user: user.id });
                element = element.toObject();
                flipthecoin(message,user,bet,choice,element);
            }
        }
    });
}

async function flipthecoin(message,user,bet,choice,inventory){
    if(inventory.money<bet){
        bet = inventory.money;
    }
    const coin = getPercentage(50) ? "heads" : "tails";
    if(coin == choice){
        await Inventory.findOneAndUpdate({user:user.id}, { $inc: {money: (bet)}})
        const Embed = new MessageEmbed()
            .setDescription(`\`${capitalizeFirstLetter(coin)}\`! You won **${bet}** coin${bet==1 ? '' : 's'}! Your balance is now \`${inventory.money+bet}\``)
            .setColor('DARK_GREEN');
        message.channel.send({embeds:[Embed]})
    }else{
        await Inventory.findOneAndUpdate({user:user.id}, { $inc: {money: (-bet)}})
        const Embed = new MessageEmbed()
            .setDescription(`\`${capitalizeFirstLetter(coin)}\`! You lost **${bet}** coin${bet==1 ? '' : 's'}! Your balance is now \`${inventory.money-bet}\``)
            .setColor('DARK_GREEN');
        message.channel.send({embeds:[Embed]})
    }
}