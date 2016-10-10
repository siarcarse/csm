// parseJson helper — for demonstration purposes
var _ = require('lodash'),
    parseJson;

parseJson = function(options, context) {
    return JSON.stringify(options);
};

module.exports = parseJson;
