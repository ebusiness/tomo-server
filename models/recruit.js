var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Recruit = new Schema({

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        trim: true,
        required: true
    },

    endUser: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date,
        default: Date.now
    },

    introduction: {
        type: String,
        trim: true,
    },

    address: {
        type: String,
        trim: true
    },

    coordinate:{
        type: [Number],
        index: '2d'
    },

    candidates: [{
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

// enable virtual output
Recruit.set('toJSON', { virtuals: true });
Recruit.set('toObject', { virtuals: true });

mongoose.model('Recruit', Recruit);
