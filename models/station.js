var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Station = new Schema({

    name: {
        type: String,
        trim: true
    },

    line: {
        type: String,
        trim: true
    },

    zipCode: {
        type: String,
        trim: true
    },

    address: {
        type: String,
        trim: true
    },

    coordinate:{
        type: [Number],
        index: '2d'
    },

    color: {
        type: String,
        trim: true
    },
});

mongoose.model('Station', Station);
