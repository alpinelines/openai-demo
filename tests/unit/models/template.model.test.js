const mongoose = require('mongoose');
const { PromptTemplate } = require('../../../src/models');

describe('PromptTemplate model', () => {
  describe('PromptTemplate validation', () => {
    let newPromptTemplate;
    beforeEach(() => {
      newPromptTemplate = {
        _id: mongoose.Types.ObjectId(),
        creator: mongoose.Types.ObjectId(),
        name: 'PromptTemplate 1',
        model: 'text-davinci-003',
        temperature: 0.6,
        prompt: 'Hello, <name>! Welcome to the demonstration of our new app, <appName>.',
        variables: [
          {
            _id: mongoose.Types.ObjectId(),
            key: '<name>',
          },
          {
            _id: mongoose.Types.ObjectId(),
            key: '<appName>',
            description: 'Lorem ipsum...',
          },
        ],
      };
    });

    test('should correctly validate a valid prompt', async () => {
      await expect(new PromptTemplate(newPromptTemplate).validate()).resolves.toBeUndefined();
    });

    test('should throw error if prompt does not include any variables in the format <varName>', async () => {
      newPromptTemplate.prompt = 'Hello, World... Goodbye, World!';
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw error if prompt includes any improperly formatted variables', async () => {
      newPromptTemplate.prompt = 'Hello, <name... Goodbye, <name!';
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw error if template does not include any variables in the format <varName>', async () => {
      newPromptTemplate.variables = 'Hello, World... Goodbye, World!';
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw error if  does not include any variables in the format <varName>', async () => {
      newPromptTemplate.variables = 'Hello, World... Goodbye, World!';
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw a validation error if a variable key does not match format <varName>', async () => {
      newPromptTemplate.variables = [{ key: '<badVar', val: undefined }];
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw a validation error if name is less than 3 characters', async () => {
      newPromptTemplate.name = 'ab';
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw a validation error if model is not supported', async () => {
      newPromptTemplate.model = 'chatgpt';
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw a validation error if temperature is out of range', async () => {
      newPromptTemplate.temperature = 1.1;
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
      newPromptTemplate.temperature = -0.1;
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });

    test('should throw a validation error if no variables are provided', async () => {
      newPromptTemplate.variables = null;
      await expect(new PromptTemplate(newPromptTemplate).validate()).rejects.toThrow();
    });
  });

  // describe('PromptTemplate generatePrompt()', () => {
  //   test('should return the correct prompt', async () => {
  //     const newPromptTemplate = new PromptTemplate({
  //       _id: mongoose.Types.ObjectId(),
  //       name: 'PromptTemplate 1',
  //       model: models[0],
  //       temperature: 0.6,
  //       prompt: 'Hello, <name>! Welcome to <appName>.',
  //       variables: [
  //         {
  //           key: '<name>',
  //           val: undefined,
  //         },
  //         {
  //           key: '<appName>',
  //           val: undefined,
  //         },
  //       ],
  //     });
  //     await expect(
  //       promptService.generatePrompt(
  //         newPromptTemplate._id,
  //         [
  //           {
  //             key: '<name>',
  //             val: 'Jack',
  //           },
  //           {
  //             key: '<appName>',
  //             val: 'promptAPI',
  //           },
  //         ]
  //       )
  //     ).resolves//.toString('Hello, Jack! Welcome to promptAPI.');
  //   });
  // });
});
