var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Group = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    name: {
        type: String,
        trim: true,
        required: true
    },

    introduction: {
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

// enable virtual output
Group.set('toJSON', { virtuals: true });
Group.set('toObject', { virtuals: true });

mongoose.model('Group', Group);
