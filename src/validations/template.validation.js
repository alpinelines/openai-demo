const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPromptTemplate = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    model: Joi.string().required(),
    temperature: Joi.number().required(),
    prompt: Joi.string().required(),
    variables: Joi.array().required(),
  }),
};

const getPromptTemplates = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPromptTemplate = {
  params: Joi.object().keys({
    promptId: Joi.string().custom(objectId),
  }),
};

const updatePromptTemplate = {
  params: Joi.object().keys({
    promptId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      model: Joi.string().required(),
      temperature: Joi.number().required(),
      prompt: Joi.string().required(),
      variables: Joi.array().required(),
    })
    .min(1),
};

const deletePromptTemplate = {
  params: Joi.object().keys({
    promptId: Joi.string().custom(objectId),
  }),
};

const execPromptTemplate = {
  params: Joi.string().required().custom(objectId),
  body: Joi.object()
    .keys({
      userId: Joi.string().required().custom(objectId),
      variables: Joi.string().required().custom(objectId),
    })
    .min(2),
};

module.exports = {
  createPromptTemplate,
  getPromptTemplates,
  getPromptTemplate,
  updatePromptTemplate,
  deletePromptTemplate,
  execPromptTemplate,
};
