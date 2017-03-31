var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Activity = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    type: {
        type: String,
        trim: true,
        required: true
    },

    relateUser: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    relatePost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },

    relateComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },

    relateGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },

    relateCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    relateReplyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },

    relateMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
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

mongoose.model('Activity', Activity);
