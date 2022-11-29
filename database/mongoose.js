const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
    user: Number,
    inventory: [Number],
    money: Number
})
const Inventory = mongoose.model('Inventory',InventorySchema)

const PatchSchema = new mongoose.Schema({
    date: Date,
    content: String
})
const Patch = new mongoose.model('Patch', PatchSchema)

module.exports = {Inventory, Patch}