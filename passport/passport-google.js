'use strict';

const passport = require('passport');
const User = require('../models/user');
const secret = require('../secret/secretFile');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// This method looks for user id in the collection
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// This method looks for user id in session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    console.log(profile);
    User.findOne({google: profile.id}, (err, user) => {
        if(err){
            return done(err);
        }

        if (user) {
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.image.url;

            newUser.save((err) => {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        }
       
    });
}));