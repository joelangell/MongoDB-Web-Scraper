var mongoose = require('mongoose')

var Schema = mongoose.Schema

var comments = new Schema({
    comment: {
        type: String
    }, 
    is_deleted: {
        type: Boolean,
        default: false
    }
})



module.exports = mongoose.model('comments', comments)