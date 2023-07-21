// imports
const express = require('express');
const app= express();
const expressLayouts= require('express-ejs-layouts');
const db = require('./config/mongoose')
const port = 5555;
 
//used for session cookie
const session =require('express-session');
const passport =require('passport')
const passpostLocal =require('./config/passport_local_strategy')
const passportGoogle = require('./config/passport_google_oauth2_strategy');


const MongoStore = require('connect-mongo');

app.use(express.urlencoded());
app.use(express.static('./assets'));

// set up template engine
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// app.set('layout','./views/layouts/layout');
app.set('view engine','ejs');
app.set('views','./views')


app.use(session({
    name:'info',
    secret:'tufani',
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1/users_development',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'disabled'
    })
}))


// Configure Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use routes
app.use('/',require('./routes'));


app.listen(port, function (err) {
    if (err) {
        console.log(`Error : ${err}`);
    }
    console.log(`server is running perfectly on port ${port}`)
})