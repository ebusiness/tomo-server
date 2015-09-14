var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Comment = require('./comment');

var Post = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        trim: true,
    },

    images: [{
        type: String,
        trim: true
    }],

    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    bookmark: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    bookmarked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    comments: [Comment],

    coordinate:{
        type: [Number],
        index: '2d'
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

// Create images reference point to s3
Post.virtual('images_ref').get(function () {

    // if the _owner field was populated, it should be an object
    // and the owner's id will be embeded in that object, so we need extract it.
    var userId = this.owner._id ? this.owner._id : this.owner;

    if (this.images && this.images.length)
        return _.map(this.images, function(path) {
            return _s.join('/', config.s3.host, config.s3.bucket, 'users', userId, 'post', path);
        });
    else
        return [];
});

Post.set('toJSON', { virtuals: true });
Post.set('toObject', { virtuals: true });

mongoose.model('Post', Post);
