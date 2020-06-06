const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const api = require('./api');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log("DB connected!");
        server.emit('mongoose_connected');
    })
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

let host = `http://localhost:${PORT}`;

if (process.env.NODE_ENV === "production") {
    host = `https://${process.env.URL}`;
}

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Homie Chat",
            version: "1.0.0",
            description:
                "Homie Chat API documentations",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "Hai Huynh Ngoc",
                url: "https://facebook.com/haihn24",
                email: "haihuynhngoc24@gmail.com"
            }
        },
        servers: [
            {
                url: host
            }
        ],
        host, // Host (optional)
        basePath: '/', // Base path (optional)
        components: {
            securitySchemes:
                {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        in: "header"
                    }
                }
        }
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve);

app.get(
    "/docs",
    swaggerUi.setup(specs, {
        explorer: true
    })
);

app.use(
    jwt({secret: process.env.JWT_SECRET}).unless({
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

api.router.bootstrap(app);

api.socket.bootstrap(io);

app.use(require('./middlewares/errorHandleMiddleware'));

server.on('mongoose_connected', () => {
    server.listen(PORT, () => {
        console.log("Server is running...")
    });
});


