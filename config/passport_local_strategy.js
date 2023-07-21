const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
console.log("email");
    // console.log("passpost_local_strategy ---->", email);

    try {
        //first find the user in the database if exist
        const user = await User.findOne({ email: email });

        //if user does not exist or the password id wrong
        if (!user || user.password != password) {
            return done(null, false);
        }
        // if all OK and CORRECT
        done(null, user);
    } catch (error) {
        console.log("passpost_local_strategy ---->", error);
        return done(error)
    }
}))


// to save a specific key in the session cookie ---> serialize the user
passport.serializeUser((user, done) => {
    // console.log("passport_local_strategy---> serializeUser---->", user)
    done(null, user.id);
})

// to get the whole user object when required ---> deserializeUser
passport.deserializeUser(async (id, done) => {
    // console.log("passport_local_strategy---> deserialize user---->", id)
    try {
        //first find the user in the database if exist
        const user = await User.findById(id);
        done(null, user);

    } catch (error) {
        console.log("passpost_local_strategy ----> deserialize user---->", error);
        return done(error)
    }
})

// to check if the user is allowed to visit the requested page
passport.checkAuthentication =(req,res,next)=>{
    //if the user is signed in then pass the req to the next function (controllers)
    if(req.isAuthenticated()){
        return next();
    }
//if user is not signed in then redirect to sign in page
    return res.redirect('/')
}

passport.setAuthenticatedUser = (req,res, next)=>{
    if(req.isAuthenticated()){
        res.locals.user =req.user;
    }
    next();
}


module.exports= passport;