'use strict';
/* api/router/index.js */

/*
  Bootstrap routes on main express app.
*/
let bootstrap = (app) => {
    app.use('/user', require('./user'));
    app.use('/auth', require('./auth'));
    app.use('/rooms', require('./room'));
    app.use('/messages', require('./message'));
};

module.exports = {
    bootstrap: bootstrap
};
