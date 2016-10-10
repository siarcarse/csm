// ifCond Helper
var _ = require('lodash'),
    ifCond;

ifCond = function(value1, value2, context) {
    if (value1 === value2) {
        return options.fn(this);
    }
    return options.inverse(this);
};

module.exports = ifCond;
