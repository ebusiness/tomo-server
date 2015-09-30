var _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupMessage = new Schema({

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
        ref: 'Group',
        required: true
    },

    content: {
        type: String,
        trim: true,
        required: true
    },

    opened: [{
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

mongoose.model('GroupMessage', GroupMessage);
