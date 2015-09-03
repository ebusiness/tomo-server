var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Invitation = new Schema({

    type: {
        type: String,
        trim: true,
        required: true
    },

    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    result: {
        type: String,
        trim: true
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

mongoose.model('Invitation', Invitation);
