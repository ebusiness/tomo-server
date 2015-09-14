var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Group = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    type: {
        type: String,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
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

    address: {
        type: String,
        trim: true
    },

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

    // station: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Station'
    // },

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
        return _s.join('/', config.s3.host, config.s3.bucket, 'groups', this._id, 'cover', this.cover);
    else
        return _s.join('/', config.s3.host, config.s3.bucket, 'asset/default_cover.jpg');
});

// enable virtual output
Group.set('toJSON', { virtuals: true });
Group.set('toObject', { virtuals: true });

mongoose.model('Group', Group);
