const mongoose = require('mongoose')
const itemsSchema = {
    name: { type: String, required: true, unique: true }
}
const listSchema = {
    name: { type: String, required: true, unique: true },
    items: [itemsSchema]
}

const Item = mongoose.model('Item', itemsSchema)
const List = mongoose.model('List', listSchema)