var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Comment = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        trim: true,
    },

    logicDelete: {
        type: Boolean,
        default: false
    },

    createDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Comment', Comment);
module.exports = Comment;
