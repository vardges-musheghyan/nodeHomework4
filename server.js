const dotEnv = require('dotenv');

dotEnv.config({path: './config.env'});

const express = require('express');

const PORT = process.env.PORT || 5000;

const users =  require('./routes/users');

const auth = require('./routes/auth');

const logger = require('./middleware/logger');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development'){
    app.use(logger);
}


// connecting the users route to the router

app.use('/api/users', users);

app.use('/api/auth', auth);

app.listen(PORT, function initialize() {
    console.log(`server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
});




