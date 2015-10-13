var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator').validatorjs,
    Schema = mongoose.Schema;

var User = new Schema({

    type: {
        type: String,
        trim: true
    },

    device: {
        os: {
            type: String,
            trim: true
        },
        version: {
            type: String,
            trim: true
        },
        model: {
            type: String,
            trim: true
        },
        token: {
            type: String,
            trim: true
        }
    },

    pushSetting: {
        announcement: {
            type: Boolean,
            default: true
        },
        message: {
            type: Boolean,
            default: true
        },
        groupMessage: {
            type: Boolean,
            default: true
        },
        friendInvited: {
            type: Boolean,
            default: true
        },
        friendAccepted: {
            type: Boolean,
            default: true
        },
        friendRefused: {
            type: Boolean,
            default: true
        },
        friendBreak: {
            type: Boolean,
            default: true
        },
        postNew: {
            type: Boolean,
            default: true
        },
        postCommented: {
            type: Boolean,
            default: true
        },
        postLiked: {
            type: Boolean,
            default: true
        },
        postBookmarked: {
            type: Boolean,
            default: true
        },
        groupJoined: {
            type: Boolean,
            default: true
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
      trim: true,
      required: true
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

    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],

    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],

    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    invitations: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],

    stations: [{
        type: Schema.Types.ObjectId,
        ref: 'Station'
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
        return _s.join('/', config.s3.host, config.s3.bucket, 'users', this._id, 'photo.png?', this.photo);
    else
        return _s.join('/', config.s3.host, config.s3.bucket, 'asset/no_photo_male.jpg');
});

// Create cover reference point to s3
User.virtual('cover_ref').get(function () {
    if (this.cover && validate.isURL(this.cover))
        return this.cover;
    if (this.cover)
        return _s.join('/', config.s3.host, config.s3.bucket, 'users', this._id, 'cover.png?', this.cover);
    else
        return _s.join('/', config.s3.host, config.s3.bucket, 'asset/default_cover.jpg');
});

User.set('toJSON', { virtuals: true });
User.set('toObject', { virtuals: true });

mongoose.model('User', User);
