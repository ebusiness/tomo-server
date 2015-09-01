var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResetPassword = new Schema({

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    
    createDate: {
        type: Date,
        default: Date.now,
        expires: 60 * 60
    }
});

mongoose.model('ResetPassword', ResetPassword);
