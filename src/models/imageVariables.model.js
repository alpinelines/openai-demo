const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { regexIsURL } = require('../constants/regex');

// TODO: Determine required validators.
// TODO: Confirm schema.
const imagePromptVariablesSchema = mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      validate: regexIsURL,
    },
    sample: {
      type: Number,
      required: true,
    },
    negativePrompt: String,
    width: {
      type: Number,
      min: 768,
      max: 1024,
    },
    height: {
      type: Number,
      min: 768,
      max: 1024,
    },
    promptStrength: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    numInterferenceSteps: {
      type: Number,
      min: 1,
      max: 20,
    },
    enhancePrompt: Boolean,
    seed: String,
    webhook: {
      type: String,
      validate: regexIsURL,
    },
    trackId: String,
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
imagePromptVariablesSchema.plugin(toJSON);
imagePromptVariablesSchema.plugin(paginate);

/**
 * @typedef ImagePromptVariables
 */
const ImagePromptVariables = mongoose.model('ImagePromptVariables', imagePromptVariablesSchema);

module.exports = ImagePromptVariables;
