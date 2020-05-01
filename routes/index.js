module.exports = app => {
    app.use('/users', require('./user'));
    app.use('/auth', require('./auth'));
};
