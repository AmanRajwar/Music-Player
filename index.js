// imports
const express = require('express');
const app= express();
const expressLayouts= require('express-ejs-layouts');
const db = require('./config/mongoose')
const port = 5555;


app.use(express.urlencoded());
app.use(express.static('./assets'));

// set up template engine
app.use(expressLayouts);

// app.set('layout','./views/layouts/layout');
app.set('view engine','ejs');
app.set('views','./views')

// use routes
app.use('/',require('./routes'));


app.listen(port, function (err) {
    if (err) {
        console.log(`Error : ${err}`);
    }
    console.log(`server is running perfectly on port ${port}`)
})