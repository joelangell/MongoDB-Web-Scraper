var mongoose = require('mongoose')

var Schema = mongoose.Schema

var reviews = new Schema({
    artist: {
        type: String
    }, 
    title: {
        type: String
    }, 
    genre: {
        type: String
    }, 
    img: {
        type: String
    },
    link: {
        type: String
    },
    comment: [{
        type:  Schema.Types.ObjectId,
        ref: "comments"
    }]
})


module.exports = mongoose.model('reviews', reviews)


// comment: [{
//     type: Schema.Types.ObjectId,
//     ref: 'comments'
// }]