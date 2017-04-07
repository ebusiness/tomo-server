var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Project = new Schema({

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

    relCompanies: [{
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }],

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date,
        default: Date.now
    },

    cover: {
        type: String,
        trim: true
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

    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
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

// Create cover reference point to s3
Project.virtual('cover_ref').get(function () {
    if (this.cover)
        return _s.join('/', config.s3.host, config.s3.bucket, 'project', this._id, 'cover.png');
    else
        return _s.join('/', config.s3.host, config.s3.bucket, 'asset/default_cover.jpg');
});

// enable virtual output
Project.set('toJSON', { virtuals: true });
Project.set('toObject', { virtuals: true });

mongoose.model('Project', Project);
