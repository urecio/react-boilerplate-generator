
const trimTemplateFile = require('../utils/trimTemplateFile');
const _ = require('lodash');

const questions = [
  {
    type: 'input',
    name: 'asyncRequests',
    validate: (answer) => /^([\da-zA-Z]+)(,[\da-zA-Z]+)*$/g.test(answer) || 'Incorrect format (teXt,Text)',
    message: 'Enter a comma separated list of METHOD names (will be used on constants and actions)',
  },
  {
    type: 'input',
    name: 'asyncRequestsResourceNames',
    validate: (answer) => /^([\da-zA-Z]+)(,[\da-zA-Z]+)*$/g.test(answer) || 'Incorrect format (teXt,Text)',
    message: 'Enter a comma separated list of RESOURCE names (reducer data will create those vars)',
  },
  {
    type: 'input',
    name: 'asyncRequestsApiRoute',
    validate: (answer, answers) => (
      /^[($|{|}|a-z|A-Z|0-9|/|.|_)]+(,[($|{|}|a-z|A-Z|0-9|/|.|_)]+)*$/g.test(answer)
      && answers.asyncRequests.split(',').length === answer.split(',').length
    ) || 'Incorrect format',
    message: 'In the same order as above, enter the API path for the requests',
  },
  {
    type: 'input',
    name: 'asyncRequestsApiRequestMethods',
    validate: (answer, answers) => (/^[a-z|A-Z|0-9]+(,[a-z|A-Z|0-9]+)*$/g.test(answer)
      && answers.asyncRequests.split(',').length === answer.split(',').length
    ) || 'Incorrect format',
    message: 'In the same order as above, enter the METHOD for the requests (get,post,put...)',
  }
];

function generateAsyncRequestsAndReturnData(data) {
  const asyncRequestsArr = data.asyncRequests.split(',');
  const asyncRequestsApiRouteArr = data.asyncRequestsApiRoute.split(',');
  const asyncRequestsApiRequestMethodsArr = data.asyncRequestsApiRequestMethods.split(',');
  const asyncRequestsResourceNamesArr = data.asyncRequestsResourceNames.split(',');
  data.asyncRequestsResourceNameForState = _.uniq(asyncRequestsResourceNamesArr).map(name => ({ name }));
  data.getAsyncRequests = [];
  data.postAsyncRequests = [];
  data.putAsyncRequests = [];

  const asyncRequestFactory = (index) => ({
    name: asyncRequestsArr[index],
    route: asyncRequestsApiRouteArr[index],
    method: asyncRequestsApiRequestMethodsArr[index],
    resource: asyncRequestsResourceNamesArr[index],
  });

  // Maps the async requests so that the templates can use them
  data.asyncRequests = asyncRequestsArr.map((name, index) => {
    const asyncRequest = asyncRequestFactory(index);

    // will push to a collection called data.get|put|post+AsyncRequests
    data[`${asyncRequestsApiRequestMethodsArr[index]}AsyncRequests`].push(asyncRequest);
    return asyncRequest;
  });

  return data;
}

module.exports = {
  questions,
  generateAsyncRequestsAndReturnData,
};
