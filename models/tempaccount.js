var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TempAccount = new Schema({

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    nickName: {
        type: String,
        trim: true
    },

    createDate: {
        type: Date,
        default: Date.now,
        expires: 60 * 60
    }
    
});

mongoose.model('TempAccount', TempAccount);
