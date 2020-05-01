const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("DB connected!");
        app.emit('mongoose_connected');
    })
    .catch(err => console.log(err));

app.use(
    jwt({ secret: process.env.JWT_SECRET}).unless({
        path: [
            '/',
            '/auth/signup',
            '/auth/login',
            '/auth/forgot-password',
            '/auth/reset-password',
        ],
    }),
);

app.use(require('./middlewares/authMiddleware'));

routes(app);
app.use(require('./middlewares/errorHandleMiddleware'));
const PORT = process.env.PORT || 5000;
app.on('mongoose_connected', () => {
    app.listen(PORT, () => {
        console.log("Server is running...")
    });
});


