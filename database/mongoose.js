const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
    user: Number,
    inventory: [Number]
})
const Inventory = mongoose.model('Inventory',InventorySchema)

module.exports = {Inventory}