const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { models } = require('../constants/models');

// TODO: promptTemplateSchema String type minLength attributes.
// TODO: promptTemplateSchema variables subdocument validator.
// TODO: Confirm schema.
const promptTemplateSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    model: {
      type: String,
      required: true,
      enum: Object.values(models),
    },
    temperature: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    prompt: {
      type: String,
      required: true,
      validate: (value) => {
        // eslint-disable-next-line
        const regex = new RegExp(/<(\"[^\"]*\"|'[^']*'|[^'\">])*>/);
        return value.split(' ').some((val) => regex.test(val) === true);
      },
    },
    imageVariables: {
      type: mongoose.ObjectId,
      ref: 'ImagePromptVariables',
      required: false,
    },
    variables: {
      type: [
        {
          type: mongoose.ObjectId,
          ref: 'PromptVariable',
        },
      ],
      validate: (val) => (val.length > 0 ? 'true' : 'false'),
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
promptTemplateSchema.plugin(toJSON);
promptTemplateSchema.plugin(paginate);

/**
 * @typedef PromptTemplate
 */
const PromptTemplate = mongoose.model('PromptTemplate', promptTemplateSchema);

module.exports = PromptTemplate;
