// ifCond Helper
var _ = require('lodash'),
    ifCond;

ifCond = function(value1, value2, context) {
    if (value1 === value2) {
        return context.fn(this);
    }
    return context.inverse(this);
};

module.exports = ifCond;
