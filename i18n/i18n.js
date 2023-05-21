const fs = require('fs');
const { Collection } = require('discord.js');
const path = require('path');
const objects = require('../database/objects.json')

const valueAtPath = (object, path) => path.reduce((r,p) => r?.[p], object);   //returns the value of the property stored in 'object' at path 'path'; path is an array

var i18n = {
    langs: new Collection(),
    default: 'en',
    init(){
        const locales = fs.readdirSync(path.resolve('./','locales')).filter(file => file.endsWith('.json'));
        for (const file of locales) {
            const lang = require(`../locales/${file}`);
            this.langs.set(lang.iso, lang);
        }
    },
    t(path,guild,opt){      // translate function
        const guilds = require('../guilds.json');
        let lang = this.langs.get(guilds[guild] == undefined ? this.default : guilds[guild].lang == undefined ? this.default : guilds[guild].lang);   //get language of guild, if undefined, uses default
        path = path.split('.'); //split the path string into several properties stored in an array : "commands.category.command" => ["commands","category","command"]
        let str = valueAtPath(lang,path)    //returns
        if(str==undefined){     //if traduction not found in the selected language, uses default 
            lang = this.langs.get(this.default)
            str = valueAtPath(lang,path)
        }
        if(str==undefined){
            console.error('i18n was not able to find value at path: '+path.join('.'))
        }else{
            if(opt!= undefined) {   
                /*  Replace expressions in curly brackets by value: "{user}"" => "Vic" ; "{prefix}" => "!" 
                    These values must be stored in the 'opt' object: {user : "Vic", prefix: "!"}   */
                    for (let i of Object.keys(opt)){
                        let reg = new RegExp(`{${i}}`,'g');
                        try {
                            str = str.replace(reg,opt[i])
                        } catch (error) {
                            console.error(error)
                        }
                    }
        
                }       
        }   
        return(str);
    },

    i(object,guild){        //item: adds name, use and description keys at the object provided
        const items = this.t("items",guild)
        if(Number.isInteger(parseInt(object))){
            object = objects.find(a => a.id == parseInt(object))
        }else if(typeof object == 'string'){
            const item = items.find(i => i.name == object.toLowerCase())
            object = objects.find(a => a.id == item.id)
            Object.assign(object,item)
        }
        if(Array.isArray(object)){
            for(let k in object){
                Object.assign(object[k], items.find(i => i.id == object[k].id));
            }
        }else{
            Object.assign(object, items.find(i => i.id == object.id));
        }
        return(object);
    }
}

module.exports = {i18n}