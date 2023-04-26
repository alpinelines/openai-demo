const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const promptSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    template: {
      type: mongoose.ObjectId,
      ref: 'PromptTemplate',
      required: true,
    },
    results: {
      type: Object,
      required: true,
      validate: (value) => {
        return value.length >= 1;
      },
    },
  },
  {
    timestamps: true,
  }
);

promptSchema.plugin(toJSON);
promptSchema.plugin(paginate);

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
