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

    targetId: {
        type: Schema.Types.ObjectId
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
