'use strict';

const passport = require('passport');
const User = require('../models/user');
const secret = require('../secret/secretFile');
const InstagramStrategy = require('passport-instagram').Strategy;

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

passport.use(new InstagramStrategy({
    clientID: secret.instagram.clientID,
    clientSecret: secret.instagram.clientSecret,
    callbackURL: 'http://localhost:3000/auth/instagram/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile, {tokens: {accessToken: accessToken, refreshToken: refreshToken}});
    console.log(profile);
    User.findOne({
        instagram: profile.id
    }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.instagram = profile.id;
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