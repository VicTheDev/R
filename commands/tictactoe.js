const {MessageEmbed,MessageActionRow,MessageButton} = require('discord.js');
const {getPercentage} = require('../maths');
const wait = require('util').promisify(setTimeout); //Wait x ms
const cross = "  X  ";
const round = "  O  ";
const blank = "     ";
module.exports = {
    name: "tictactoe",
    description: "Start a game of Tic Tac Toe.",
    category: "Fun",
    use: "`!tictactoe <user>` - Propose une partie de morpion à l'utilisateur mentionné",
    example: "`!tictactoe @Vic`",
    async execute(message,args){
        const player1 = message.member;
        const player2 = message.mentions.members.first()
        let turn = getPercentage(50) ? player1 : player2;
        const playerindex = [0,player1,player2]

        let grid = [[0,0,0],[0,0,0],[0,0,0]];
        let gstr = [["\n     |     |\n","\n_____|_____|_____"],[["     ","     ",""],["     ","     ",""],["     ","     ",""]]]; //grid string, array used to generate visually the grid

        if(player2 != undefined && player2 != player1){
            message.delete()
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ok')
                        .setLabel('Accept')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('no')
                        .setLabel('Decline')
                        .setStyle('DANGER')
                );

            const acceptmessage = await message.channel.send({content:`${player1.user} challenged ${player2.user} to a tictactoe!`, components: [row]})
            const filter = i => i.message.id == acceptmessage.id && ['ok','no'].includes(i.customId) && i.member == player2;
            const collector = acceptmessage.channel.createMessageComponentCollector({filter, time: 20_000});
            
            let answered = false
            collector.on('collect', async i => {
                switch (i.customId){
                    case 'ok':
                        await acceptmessage.edit({content:`${player2.user} accepted the game! It will start in a few seconds...`, components: []})
                        setTimeout(() => {
                            try {
                                acceptmessage.delete()
                              } catch (error) {
                                console.error('Message was deleted');
                              }
                            setMessage(player1,player2, turn,undefined)
                        }, 2000)
                        answered = true
                        collector.stop()
                        break;
                    case 'no':
                        await acceptmessage.edit({content: `${player2.displayName} declined the game.` , components: []})
                        answered = true
                        setTimeout(() => {
                            try {
                                acceptmessage.delete()
                              } catch (error) {
                                console.error('Message was deleted');
                              }
                        }, 3000)

                }
            })
            collector.on('end', async collected => {
                if(!answered){
                    await acceptmessage.edit({content: `${player2.displayName} declined the game.` , components: []})
                        setTimeout(() => {
                            try {
                                acceptmessage.delete()
                              } catch (error) {
                                console.error('Message was deleted');
                              }
                        }, 3000)
                }
            })

        }else{
            const reply = await message.reply("You must mention someone!")
            message.delete()
            setTimeout(() => {
                reply.delete()
            }, 3000)
        }



        async function setMessage(p1, p2 ,turn,botmessage,state){ // Send or update the bot's message with infos about players
            for(i in gstr[1]){
                for(k in gstr[1][i]){
                    gstr[1][i][k] = grid[i][k] == 0 ? blank : (grid[i][k]==1 ? cross : round)
                }
            }
            
            let display = ''
            for(let i = 1; i<=9; i++){
                display += [3,6].includes(i) ? gstr[0][1] : ([2,5,8].includes(i) ? gstr[1][[2,5,8].indexOf(i)].join('|') : gstr[0][0]);
            }
            display = "```"+display+"```"

            const row1 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('a')
                        .setLabel('A')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[0][0]!=0),
                    new MessageButton()
                        .setCustomId('b')
                        .setLabel('B')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[0][1]!=0),
                    new MessageButton()
                        .setCustomId('c')
                        .setLabel('C')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[0][2]!=0)
                );
            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('d')
                        .setLabel('D')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[1][0]!=0),
                    new MessageButton()
                        .setCustomId('e')
                        .setLabel('E')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[1][1]!=0),
                    new MessageButton()
                        .setCustomId('f')
                        .setLabel('F')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[1][2]!=0)
                );
            const row3 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('g')
                        .setLabel('G')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[2][0]!=0),
                    new MessageButton()
                        .setCustomId('h')
                        .setLabel('H')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[2][1]!=0),
                    new MessageButton()
                        .setCustomId('i')
                        .setLabel('I')
                        .setStyle('PRIMARY')
                        .setDisabled(grid[2][2]!=0)
                );

            const Embed = new MessageEmbed()
                .setTitle('Tic Tac Toe')
                .setDescription(display)
                .setColor('DARK_BLUE')
                .addFields({name: "Turn:", value: `${turn.user}`});

            if(botmessage==undefined){
                await wait(200);
                await message.channel.send({embeds:[Embed],components:[row1,row2,row3]})
                    .then(message => startCollector(p1, p2, turn, message))
                    .catch(console.error);  
            }else{
                switch(state){
                    case 0:
                        await wait(200);
                        await botmessage.edit({embeds:[Embed],components:[row1,row2,row3]})
                            .then(message => startCollector(p1, p2, turn, message))
                            .catch(console.error);
                        break;
                    case 1:
                        end(turn,botmessage,Embed,true)
                        break;
                    case 2:
                        end(turn,botmessage,Embed,false)
                        break;
                }
            }
        } 

        function startCollector(p1, p2, turn, botmessage){ // Collect interactions from buttons
            const filter = i => ['a','b','c','d','e','f','g','h','i'].includes(i.customId) && [p1,p2].includes(i.member)
        
            const collector = botmessage.channel.createMessageComponentCollector({ filter, time: 30_000});
        
            collector.on('collect', async i => {
                if(i.message.id === botmessage.id){
                    if(i.member == turn){
                        switch (i.customId){
                            case 'a':
                                grid[0][0] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'b':
                                grid[0][1] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'c':
                                grid[0][2] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'd':
                                grid[1][0] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'e':
                                grid[1][1] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'f':
                                grid[1][2] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'g':
                                grid[2][0] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'h':
                                grid[2][1] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                            case 'i':
                                grid[2][2] = playerindex.indexOf(turn)
                                i.deferUpdate();
                                collector.stop();
                                break;
                        }
                    }else{
                        i.reply({content: "Ce n'est pas votre tour de jouer !", ephemeral:true})
                    }
                }
            });
        
            collector.on('end', async collected => {
                nextturn(p1,p2,turn,botmessage)
            });
        }

        function nextturn(p1, p2 , turn, botmessage){ // Pass to next round
            if(iswon()){
                setMessage(p1,p2,turn,botmessage,2)
            }else{
                let count = 0
                for(k of grid){
                    for(i of k){
                        count += i!=0 ? 1 : 0
                    }
                }
                if(count==9){
                    setMessage(p1,p2,turn,botmessage,1)
                }else{
                    turn = turn == p1 ? p2 : p1
                    setMessage(p1,p2,turn,botmessage,0)
                }
            }
        }

        function iswon(){
            for(k of grid){
                if(k[0]==k[1]&&k[1]==k[2]&&k[0]!=0){    //lines
                    return true;
                }
            }
            for(i in [0,1,2]){
                if(grid[0][i]==grid[1][i]&&grid[2][i]==grid[1][i]&&grid[0][i]!=0){  //columns
                        return true;                    
                    }
            }
            if(grid[1][1]!=0&&((grid[0][0]==grid[1][1]&&grid[1][1]==grid[2][2]&&grid[0][0]!=0)||(grid[0][2]==grid[1][1]&&grid[1][1]==grid[2][0]))){     //diagonals
                return true;
            }
            return false;
            
        }

        async function end(turn,botmessage,Embed, tie){
            Embed.fields = []
            const winner = new MessageEmbed()
                .setDescription(tie ? '**Tie!**' : `${turn.user} **won** the game!`)
                .setColor('ffd700');
            await wait(200);
            await botmessage.edit({embeds:[Embed,winner],components:[]});
        }

    }
}