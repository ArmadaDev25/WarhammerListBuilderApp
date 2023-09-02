const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    author: {type: String, required: true},
    comment: {type: String, required: true}
})

module.exports = CommentSchema