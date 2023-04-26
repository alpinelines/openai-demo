const mongoose = require('mongoose');
const faker = require('faker');
const models = require('../../src/constants/models');
const { PromptTemplate } = require('../../src/models');

// TODO: Implement testing for TemplateTemplates

const templateOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'Template 1',
  model: models.gpt4,
  temperature: 0.6,
  prompt: 'Hello, <name>! Welcome to the demonstration of our new app, <appName>.',
  negativePrompt: 'Hello, <name>! Welcome to the demonstration of our new app, <appName>.',
  variables: [
    {
      key: '<name>',
      val: faker.name.findName(),
    },
    {
      key: '<appName>',
      val: 'promptAPI',
    },
  ],
};

const templateTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'Template 2',
  model: models.gpt4,
  temperature: 0.6,
  prompt: '<name>, this world is a wild world.',
  variables: [
    {
      key: '<name>',
      val: faker.name.findName(),
    },
    {
      key: '<appName>',
      val: 'promptAPI',
    },
  ],
};

const insertTemplates = async (templates) => {
  await PromptTemplate.insertMany(templates.map((template) => ({ ...template })));
};

module.exports = {
  templateOne,
  templateTwo,
  insertTemplates,
};
