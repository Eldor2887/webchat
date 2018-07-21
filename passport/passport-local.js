'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

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

passport.use('localSignup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, false, req.flash('error', 'User with email already exist!'));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            if (err) {
                console.log(err);
            }
            done(null, newUser);
        });
    });
}));


passport.use('localLogin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email':email}, (err, user) => {
        if (err) {
            return done(err);
        }

       var messages = [];
       if (!user || !user.validUserPassword(password)) {
           messages.push('Email Does Not Exist or Password Is Invalid');
           return done(null, false, req.flash('error', messages));
       }
       return done(null, user);
    });
}));