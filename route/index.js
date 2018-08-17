/**
 * Route Generator
 */
const fs = require('fs');
const path = require('path');
const componentExists = require('../utils/componentExists');
const trimTemplateFile = require('../utils/trimTemplateFile');

function reducerExists(comp) {
  try {
    fs.accessSync(path.join(__dirname, `../../../../app/containers/${comp}/reducer.js`), fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  description: 'Add a route',
  prompts: [{
    type: 'input',
    name: 'component',
    message: 'Which component should the route show?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? true : `"${value}" doesn't exist.`;
      }

      return 'The path is required';
    },
  }, {
    type: 'input',
    name: 'path',
    message: 'Enter the path of the route. (will be appended after /dashboard/)',
    default: 'about',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return true;
      }

      return 'path is required';
    },
  }],

  actions: (data) => {
    const actions = [{
      type: 'modify',
      path: '../../../app/routes.js',
      pattern: /(component: Dashboard,.*\n\s{0,}childRoutes.*:.*\[)/g,
      template: trimTemplateFile('route', 'route.hbs'),
    }];

    if (reducerExists(data.component)) {
      actions.push({
        type: 'modify',
        path: '../../../app/routes.js',
        pattern: /(const\simportModules\s=\sPromise\.all\(\[)/g,
        template: trimTemplateFile('route', 'sagaAndReducerImport.hbs'),
      });
      actions.push({
        type: 'modify',
        path: '../../../app/routes.js',
        pattern: /(importModules\.then\(\(\[)/g,
        template: trimTemplateFile('route', 'sagaAndReducerParams.hbs'),
      });
      actions.push({
        type: 'modify',
        path: '../../../app/routes.js',
        pattern: /(isExecuted\s=\strue;)/g,
        template: trimTemplateFile('route', 'sagaAndReducerInjection.hbs'),
      });
      actions.push({
        type: 'modify',
        path: '../../../app/routes.js',
        pattern: /(import.*getAsyncInjectors.*;)/g,
        template: trimTemplateFile('route', 'importContainer.hbs'),
      });
    }

    return actions;
  },
};
