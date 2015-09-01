var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({

    type: {
        type: String,
        trim: true
    },
    
    device: {
        type: {
            type: String,
            trim: true
        },
        token: {
            type: String,
            trim: true
        }
    },

    openIdWeChat: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        trim: true
    },

    firstName: {
        type: String,
        trim: true
    },

    lastName: {
        type: String,
        trim: true
    },

    nickName: {
      type: String,
      trim: true
    },

    photo: {
        type: String,
        trim: true
    },

    cover: {
        type: String,
        trim: true
    },

    birthDay: {
        type: Date
    },

    gender: {
        type: String,
        trim: true
    },

    telNo: {
        type: String,
        trim: true
    },

    address: {
        type: String,
        trim: true
    },

    bio: {
        type: String,
        trim: true
    },

    friends: [{
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

// Create photo reference point to s3
User.virtual('photo_ref').get(function () {
    if (this.photo && validate.isURL(this.photo))
        return this.photo;
    if (this.photo)
        return _s.join('/', config.s3.host, config.s3.bucket, 'users', this._id, 'photo', this.photo);
    else
        return _s.join('/', config.s3.host, config.s3.bucket, 'asset/no_photo_male.jpg');
});

// Create cover reference point to s3
User.virtual('cover_ref').get(function () {
    if (this.cover && validate.isURL(this.cover))
        return this.cover;
    if (this.cover)
        return _s.join('/', config.s3.host, config.s3.bucket, 'users', this._id, 'cover', this.cover);
    else
        return _s.join('/', config.s3.host, config.s3.bucket, 'asset/default_cover.jpg');
});

User.set('toJSON', { virtuals: true });
User.set('toObject', { virtuals: true });

mongoose.model('User', User);
