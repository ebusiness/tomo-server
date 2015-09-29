var _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Message = new Schema({

    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },

    content: {
        type: String,
        trim: true,
        required: true
    },

    opened: {
        type: Boolean,
        default: false
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

mongoose.model('Message', Message);
