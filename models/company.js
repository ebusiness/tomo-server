var _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Company = new Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    address: {
        type: String,
        trim: true,
        // required: true
    },

    coordinate: {
        type: [Number],
        index: '2d',
        required: true
    },

    homepage: {
        type: String,
        trim: true,
        required: true
    },

    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],

    type: {
        type: String, // si ,enduser, bp...
        trim: true,
        required: true
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

mongoose.model('Company', Company);
