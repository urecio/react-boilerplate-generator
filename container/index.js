/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');
const asyncRequests = require('../async_requests/utils');
const api = require('../api/utils');

module.exports = {
  description: 'Add a container component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Form',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'list',
    name: 'component',
    message: 'Select a base component:',
    default: 'PureComponent',
    choices: () => ['PureComponent', 'Component'],
  }, {
    type: 'confirm',
    name: 'wantActionsAndReducer',
    default: true,
    message: 'Do you want an actions/constants/selectors/reducer tuple for this container?',
  },
  {
    type: 'confirm',
    name: 'wantAsyncRequests',
    default: true,
    message: 'Do you want to create async requests to your api?',
  },
].concat(asyncRequests.questions.map(q => Object.assign({}, q, { when: answers => answers.wantAsyncRequests }))),
  actions: (data) => {
    // Generate index.js and index.test.js
    let actions = [{
      type: 'add',
      path: '../../../app/containers/{{properCase name}}/index.js',
      templateFile: './container/index.js.hbs',
      abortOnFail: true,
    }];

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      /* eslint-disable no-param-reassign */
      if (data.wantAsyncRequests) data = asyncRequests.generateAsyncRequestsAndReturnData(data);
      /* eslint-disable no-param-reassign */

      // Actions
      actions.push({
        type: 'add',
        path: '../../../app/containers/{{properCase name}}/actions.js',
        templateFile: './templates/actions_constants_reducer/actions.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: '../../../app/containers/{{properCase name}}/constants.js',
        templateFile: './templates/actions_constants_reducer/constants.js.hbs',
        abortOnFail: true,
      });

      // Selectors
      actions.push({
        type: 'add',
        path: '../../../app/containers/{{properCase name}}/selectors.js',
        templateFile: './templates/actions_constants_reducer/selectors.js.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: '../../../app/containers/{{properCase name}}/reducer.js',
        templateFile: './templates/actions_constants_reducer/reducer.js.hbs',
        abortOnFail: true,
      });

      // Sagas
      actions.push({
        type: 'add',
        path: '../../../app/containers/{{properCase name}}/sagas.js',
        templateFile: './templates/actions_constants_reducer/sagas.js.hbs',
        abortOnFail: true,
      });

      if (data.wantAsyncRequests) actions = api.addRequestMethodsToApiAndReturnActions(data, actions);

      actions = api.addExportsToApiAndReturnActions(data, actions);
    }

    actions.push({
      type: 'add',
      path: '../../../app/containers/{{properCase name}}/{{ properCase name }}Component.js',
      templateFile: './container/indexcomponent.js.hbs',
      abortOnFail: true,
    });

    return actions;
  },
};
