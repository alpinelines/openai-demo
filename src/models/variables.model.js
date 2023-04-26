const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// TODO: Determine required validators.
// TODO: Confirm schema.
const promptVariableSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      validate: (value) => {
        // eslint-disable-next-line
          const regex = new RegExp(/<(\"[^\"]*\"|'[^']*'|[^'\">])*>/);
        if (regex.test(value) === true) {
          return 'true';
        }
        return 'false';
      },
    },
    type: {
      type: String,
      enum: ['String', 'Number'],
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
promptVariableSchema.plugin(toJSON);
promptVariableSchema.plugin(paginate);

/**
 * @typedef PromptVariable
 */
const PromptVariable = mongoose.model('PromptVariable', promptVariableSchema);

module.exports = PromptVariable;
