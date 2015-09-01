var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Notification = new Schema({

    type: {
        type: String,
        trim: true,
        required: true
    },

    to: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // notification target (post)
    targetPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },

    // notification target (comment)
    targetComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },

    // notification target (replied comment)
    targetReplyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },

    // notification target (job)
    targetJob: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },

    // notification target (message)
    targetMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },

    // notification target (group)
    targetGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },

    confirmed: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    logicDelete: {
        type: Boolean,
        default: false
    },

    createDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Notification', Notification);
