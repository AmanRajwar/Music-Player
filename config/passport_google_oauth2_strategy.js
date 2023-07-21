const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');


// tell passport to use a new strategy for google login

passport.use(
    new googleStrategy(
      {
        clientID: "529756550109-eqbr857t58b5n6jid62asa7u9v4lq51t.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:5555/users/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find a user in the database
          const user = await User.findOne({ email: profile.emails[0].value });
  
          if (user) {
            // If user found, set this user as req.user
            return done(null, user);
          } else {
            // If user not found, create the user and set it as req.user
            const newUser = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString('hex'),
            });
  
            return done(null, newUser);
          }
        } catch (err) {
          console.log('Error in Google Strategy-Passport:', err);
          return done(err, null);
        }
      }
    )
  );


module.exports = passport;