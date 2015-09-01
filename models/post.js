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
    var userId = this._owner._id ? this._owner._id : this._owner;

    if (this.images && this.images.length)
        return _.map(this.images, function(path) {
            return _s.join('/', config.s3.host, config.s3.bucket, 'users', userId, 'post', path);
        });
    else
        return [];
});

// Create images reference point to s3
Post.virtual('images_mobile').get(function () {

    // if the _owner field was populated, it should be an object
    // and the owner's id will be embeded in that object, so we need extract it.
    var userId = this._owner._id ? this._owner._id : this._owner;

    if (this.imagesformobile && this.imagesformobile.length)
        return _.map(this.imagesformobile, function(image) {
            image.name = _s.join('/', config.s3.host, config.s3.bucket, 'users', userId, 'post', image.name);
            return image;
        });
    else
        return [];
});

// Create videp reference point to s3
Post.virtual('video_ref').get(function () {

    var userId = this._owner._id ? this._owner._id : this._owner;

    if (this.video)
        return _s.join('/', config.s3.host, config.s3.bucket, 'users', userId, 'post', this.video);
    else
        return '';
});

Post.set('toJSON', { virtuals: true });
Post.set('toObject', { virtuals: true });

mongoose.model('Post', Post);
