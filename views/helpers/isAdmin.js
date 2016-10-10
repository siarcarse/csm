// isAdmin Helper
// Usage: `{{#isAdmin}}`
// Checks whether the user has admin or owner role
var _ = require('lodash'),
    isAdmin;

isAdmin = function(options, context) {

    if (options === 'Administrador') {
        return context.fn(this);
    }else {
        return context.inverse(this);
    }
};

module.exports = isAdmin;
