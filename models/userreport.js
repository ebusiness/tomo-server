var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserReport = new Schema({

    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    reason: {
      type: String,
      trim: true
    },

    handler: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },

    process: {
      type: String,
      trim: true
    },

    handleDate: {
        type: Date
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

mongoose.model('UserReport', UserReport);
