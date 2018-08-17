const trimTemplateFile = require('../utils/trimTemplateFile');

function addExportsToApiAndReturnActions(data, actions) {
  actions.push({
    type: 'modify',
    path: '../../../app/utils/Api.js',
    pattern: /(export\s{)/g,
    template: trimTemplateFile('api', './apiexports.js.hbs'),
  });

  return actions;
}

function addRequestMethodsToApiAndReturnActions(data, actions) {
  ['get', 'post', 'put'].forEach((method) => {
    if (data[`${method}AsyncRequests`].length > 0) {
      actions.push({
        type: 'modify',
        path: '../../../app/utils/Api.js',
        pattern: /(export\s{)/g,
        template: trimTemplateFile('api', `${method}.js.hbs`),
      });
    }
  });

  return actions;
}

module.exports = {
  addExportsToApiAndReturnActions,
  addRequestMethodsToApiAndReturnActions,
};
