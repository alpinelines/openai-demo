const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { templateService } = require('../services');

const createPromptTemplate = catchAsync(async (req, res) => {
  const template = await templateService.createPrompt(req.body);
  res.status(httpStatus.CREATED).send(template);
});

const getPromptTemplates = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await templateService.queryPromptTemplates(filter, options);
  res.send(result);
});

const getPromptTemplate = catchAsync(async (req, res) => {
  const template = await templateService.getPromptById(req.params.templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PromptTemplate not found');
  }
  res.send(template);
});

const updatePromptTemplate = catchAsync(async (req, res) => {
  const template = await templateService.updatePromptById(req.params.templateId, req.body);
  res.send(template);
});

const deletePromptTemplate = catchAsync(async (req, res) => {
  await templateService.deletePromptById(req.params.templateId);
  res.status(httpStatus.NO_CONTENT).send();
});

const execPromptTemplate = catchAsync(async (req, res) => {
  // eslint-disable-next-line
  const results = await templateService.execPromptTemplate(req.params.templateId, req.body);
  res.status(httpStatus['200_MESSAGE']).send(results);
});

module.exports = {
  createPromptTemplate,
  getPromptTemplates,
  getPromptTemplate,
  updatePromptTemplate,
  deletePromptTemplate,
  execPromptTemplate,
};
