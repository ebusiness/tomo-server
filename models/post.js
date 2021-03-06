var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator').validatorjs,
    Schema = mongoose.Schema,
    Comment = require('./comment');

var Post = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
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

    comments: [Comment],

    location: {
        type: String,
        trim: true
    },

    coordinate: {
        type: [Number],
        index: '2d'
    },

    provider: {
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

// Create images reference point to s3
Post.virtual('images_ref').get(function () {
    var postId = this._id;
    if (this.images && this.images.length)
        return _.map(this.images, function(path) {
            if (validate.isURL(path))
                return path;
            else
                return _s.join('/', config.s3.host, config.s3.bucket, 'posts', postId,  path);
        });
    else
        return [];
});

Post.set('toJSON', { virtuals: true });
Post.set('toObject', { virtuals: true });

mongoose.model('Post', Post);
