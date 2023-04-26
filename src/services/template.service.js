const httpStatus = require('http-status');
const { Configuration, OpenAIApi } = require('openai');
const { PromptTemplate, Prompt } = require('../constants/models');
const ApiError = require('../utils/ApiError');

/**
 * Create a promptTemplate
 * @param {Object} promptTemplateBody
 * @returns {Promise<PromptTemplate>}
 */
const createPromptTemplate = async (promptTemplateBody) => {
  if (await PromptTemplate.isEmailTaken(promptTemplateBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return PromptTemplate.create(promptTemplateBody);
};

/**
 * Query for promptTemplates
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPromptTemplates = async (filter, options) => {
  const promptTemplates = await PromptTemplate.paginate(filter, options);
  return promptTemplates;
};

/**
 * Get promptTemplate by id
 * @param {ObjectId} id
 * @returns {Promise<PromptTemplate>}
 */
const getPromptTemplateById = async (id) => {
  return PromptTemplate.findById(id);
};

/**
 * Update promptTemplate by id
 * @param {ObjectId} promptTemplateId
 * @param {Object} updateBody
 * @returns {Promise<PromptTemplate>}
 */
const updatePromptTemplateById = async (promptTemplateId, updateBody) => {
  const promptTemplate = await getPromptTemplateById(promptTemplateId);
  if (!promptTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PromptTemplate not found');
  }
  if (updateBody.email && (await PromptTemplate.isEmailTaken(updateBody.email, promptTemplateId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(promptTemplate, updateBody);
  await promptTemplate.save();
  return promptTemplate;
};

/**
 * Delete promptTemplate by id
 * @param {ObjectId} promptTemplateId
 * @returns {Promise<PromptTemplate>}
 */
const deletePromptTemplateById = async (promptTemplateId) => {
  const promptTemplate = await getPromptTemplateById(promptTemplateId);
  if (!promptTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PromptTemplate not found');
  }
  await promptTemplate.remove();
  return promptTemplate;
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 *
 * EXAMPLE:
 *   this.prompt = 'Hello, <one>! Welcome to <two>.
 *   this.variables = { one: { placeholder: '<one>', type: String }, two: { placeholder: '<two>', type: 'string' } }
 *   input = { one: 'a', two: 'b' }
 *   prompt = 'Hello, a! Welcome to b.
 *
 * Requirements:
 *   - 1 prompt field to store whole prompt / script (type: string or obj array)
 *   - 1 variables field to store (type obj array)
 */
const generatePrompt = async (promptTemplateId, input) => {
  const prompt = PromptTemplate.findOne({ _id: promptTemplateId });
  if (input.length !== prompt.variables.length) throw new Error(httpStatus.BAD_REQUEST, 'Insufficient input');
  const re = new RegExp(/^[a-z]+$/i);
  input.forEach((el, i) => {
    if (!re.test(el.val)) throw new Error('ERROR: cannot contain numbers or alphanumerics.');
    if (prompt.variables[i].key !== el.key) throw new Error('ERROR: input does not match prompt.');
    prompt.prompt = prompt.prompt.replace(new RegExp(el.key, 'g'), el.val); // eslint-disable-line
  });
  return prompt.prompt;
};

const execPromptTemplate = async (promptTemplateId, input) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  if (!configuration.apiKey) {
    throw new ApiError(500, {
      error: {
        message: 'OpenAI API key not configured. Check .env.',
      },
    });
  }

  const template = PromptTemplate.findById(promptTemplateId);

  try {
    const response = await openai.createCompletion({
      model: template.model,
      prompt: generatePrompt(promptTemplateId, input.variables),
      temperature: template.temperature,
    });
    const prompt = new Prompt({
      user: input.userId,
      template: template._id,
      results: response,
    });
    prompt.save();
    // eslint-disable-next-line
    return completion.data.choices;
  } catch (error) {
    // eslint-disable-line
    if (error.response) {
      throw new ApiError(error.response.status, error.response.data);
    } else {
      throw new ApiError(500, error);
    }
  } // eslint-disable-line
}; // eslint-disable-line

module.exports = {
  createPromptTemplate,
  queryPromptTemplates,
  getPromptTemplateById,
  updatePromptTemplateById,
  deletePromptTemplateById,
  generatePrompt,
  execPromptTemplate,
};
