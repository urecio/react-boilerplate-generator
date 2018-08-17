/**
 * Async requests Generator
 */

const componentExists = require('../utils/componentExists');
const asyncRequests = require('./utils');
const api = require('../api/utils');
const trimTemplateFile = require('../utils/trimTemplateFile');
const fs = require('fs');

module.exports = {
  description: 'Add async requests',
  prompts: [
    {
      type: 'input',
      name: 'container',
      message: 'What container will be updated?',
      validate: (value) => {
        if ((/.+/).test(value)) {
          return componentExists(value) || 'The component does not exist';
        }

        return 'The name is required';
      },
    }
  ].concat(asyncRequests.questions),
  actions: (data) => {

    data = asyncRequests.generateAsyncRequestsAndReturnData(data); // eslint-disable-line

    let actions = [
      {
        type: 'modify',
        path: '../../../app/containers/{{properCase container}}/index.js',
        pattern: /(function\smapDispatchToProps.*[\r\n\s]+return\s{([\r\n\s]+dispatch,)?)/g,
        template: trimTemplateFile('container', 'container-modification.js.hbs'),
      },
      {
        type: 'modify',
        path: '../../../app/containers/{{properCase container}}/{{properCase container}}Component.js',
        pattern: /(static\spropTypes\s\=\s{)/g,
        template: trimTemplateFile('container', 'component-modification.js.hbs'),
      },
      //action creators
      {
        type: 'modify',
        path: '../../../app/containers/{{properCase container}}/actions.js',
        pattern: /(export.*\{)/m,
        template: trimTemplateFile('templates/actions_constants_reducer', 'actions-modification.js.hbs'),
      },
      // Constants
      {
        type: 'modify',
        path: '../../../app/containers/{{properCase container}}/constants.js',
        pattern: /(export.*;)/m,
        template: trimTemplateFile('templates/actions_constants_reducer', 'constants-modification.js.hbs'),
      },
      // reducer
      // {
      //   type: 'modify',
      //   path: '../../../app/containers/{{properCase container}}/reducer.js',
      //   pattern: /(const\sinitialState\s=\sfromJS\(\{)/g,
      //   template: trimTemplateFile('templates/actions_constants_reducer', 'reducer-resource-modification.js.hbs'),
      // },
      {
        type: 'modify',
        path: '../../../app/containers/{{properCase container}}/reducer.js',
        pattern: /(default:)/g,
        template: trimTemplateFile('templates/actions_constants_reducer', 'reducer-switch-modification.js.hbs'),
      },
      // sagas
      {
        type: 'modify',
        path: '../../../app/containers/{{properCase container}}/sagas.js',
        pattern: /(export\sfunction\*\sdefaultSaga\(\)\s\{)/g,
        template: trimTemplateFile('templates/actions_constants_reducer', 'sagas-modification.js.hbs'),
      }
    ];

    // // optionally updating the reducer resource (if it doesn't exist)
    // const reducerFile = fs.readFileSync(path.join(__dirname, `../../../app/containers/${data.container}/reducer.js`), 'utf8');
    // // cut initialState from file
    // // check with match
    // data.asyncRequestsResourceNameForState = data.asyncRequestsResourceNameForState
    //                                              .map(resourceName => !reducerFile.match(new Regex(resourceName), 'm') && resourceName);
    //
    // .match(/\s*$/m, '');

    // TODO: do a proper modification with regex
    actions = api.addExportsToApiAndReturnActions(data, api.addRequestMethodsToApiAndReturnActions(data, actions));

    return actions;
  },
};
