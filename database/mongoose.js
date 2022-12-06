const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
    user: Number,
    inventory: [Number],
    money: Number,
    daily: Date
})
const Inventory = mongoose.model('Inventory',InventorySchema)

/*const ProfileSchema = new mongoose.Schema({
    user: Number,
    color: Number,
    description: String
})
const Profile = new mongoose.model('Profile', ProfileSchema)*/

const PatchSchema = new mongoose.Schema({
    date: Date,
    content: String
})
const Patch = new mongoose.model('Patch', PatchSchema)

module.exports = {Inventory, Patch}