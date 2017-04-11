var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Experience = new Schema({
    from: {
        type: Date,
        default: Date.now
    },
    to: {
        type: Date,
        default: Date.now
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },

    introduction: {
        type: String,
        trim: true
    },

    position: {
        type: String,
        trim: true
    },

    work: {
      RFP: {
          type: Boolean,
          default: true
      },
      SA: {
          type: Boolean,
          default: true
      },
      BD: {
          type: Boolean,
          default: true
      },
      DD: {
          type: Boolean,
          default: true
      },
      CD: {
          type: Boolean,
          default: true
      },
      UT: {
          type: Boolean,
          default: true
      },
      IT: {
          type: Boolean,
          default: true
      },
      ST: {
          type: Boolean,
          default: true
      },
      OM: {
          type: Boolean,
          default: true
      },
      SUP: {
          type: Boolean,
          default: true
      },

    }
});

mongoose.model('Experience', Experience);
module.exports = Experience;
