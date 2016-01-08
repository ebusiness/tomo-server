var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Group = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    // possible value: 'station', 'site', 'normal'
    type: {
        type: String,
        trim: true
    },

    // possible value: 'public', 'semi-private', 'private'
    privacy: {
        type: String,
        trim: true
    },

    name: {
        type: String,
        trim: true,
        required: true
    },

    cover: {
        type: String,
        trim: true
    },

    introduction: {
        type: String,
        trim: true,
    },

    coordinate:{
        type: [Number],
        index: '2d'
    },

    pref: {
        type: String,
        trim: true
    },

    address: {
        type: String,
        trim: true
    },

    watchers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    invitations: [{
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
Group.virtual('cover_ref').get(function () {
    if (this.cover)
        return _s.join('/', config.s3.host, config.s3.bucket, 'groups', this._id, 'cover.png');
    else
        return _s.join('/', config.s3.host, config.s3.bucket, 'asset/default_cover.jpg');
});

// enable virtual output
Group.set('toJSON', { virtuals: true });
Group.set('toObject', { virtuals: true });

mongoose.model('Group', Group);
