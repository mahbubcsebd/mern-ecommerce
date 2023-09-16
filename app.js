const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const userRoute = require('./api/routes/userRoute');
const seedRoute = require('./api/routes/seedRoute');
// const seedRouter = require('./api/routes/seed.route');


// http-errors is a middleware which creates an error object
const createError = require('http-errors');
// morgan is a middleware which logs all the requests to the console
const morgan = require('morgan');
// body-parser is a middleware which parses the incoming request body
const bodyParser = require('body-parser');
// Rate Limiter  is a middleware which limits the number of requests a client can make
// Cors is a middleware which allows cross-origin requests
const cors = require('cors');
const seedRouter = require('./api/routes/seedRoute');


const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});





// Middlewares
// Static files
app.use(express.static('public'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(rateLimiter);


app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Home Page',
    });
});

app.use('/api/users', userRoute);
app.use('/api/seed', seedRoute);





// Client Error Handling Middleware
app.use((req, res, next) => {
    next(createError(404, '404 Not Found'));
});




// Server Error Handling Middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal Server Error',
    });
});




module.exports = app;
