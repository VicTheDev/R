const {initSetPage} =require('../database/shoppages.js')
module.exports = {
    name:'shop',
    category: "Inventory",
    async execute(message, args) {
        let page = "home"
        if(args[0]!== undefined){
            if(['buy','sell'].includes(args[0].toLowerCase())){page=args[0]};
        }
        initSetPage(page,message,undefined) 
    }
}