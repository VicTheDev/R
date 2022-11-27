const {initSetPage} =require('../database/shoppages.js')
module.exports = {
    name:'shop',
    description:'Welcome in the Shop! Buy or sell some cool stuff here!',
    async execute(message, args) {
        let page = "home"
        if(args[0]!== undefined){
            if(['buy','sell'].includes(args[0].toLowerCase())){page=args[0]};
        }
        initSetPage(page,message,undefined) 
    }
}