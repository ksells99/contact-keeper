const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// CONNECT DB
connectDB();

// INITIALISE MIDDLEWARE
app.use(express.json({extended: false}));  // can now accept body data

// app.get('/', (req, res) => 
//     res.json({msg: 'Welcome to the ContactKeeper API'})
// );

// DEFINE ROUTES

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// SERVE STATIC ASSETS IN PRODUCTION
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
};

const PORT = process.eventNames.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));