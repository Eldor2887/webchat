'use strict';

module.exports = function (_, passport, userValidation) {
    return {
        SetRouting: function (router) {
            // GET ROUTES
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);
            // FACEBOOK ROUTE
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            // GOOGLE ROUTE
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);
            // INSTAGRAM ROUTE
            router.get('/auth/instagram', this.getInstagramLogin);
            router.get('/auth/instagram/callback', this.instagramLogin);
            // POST ROUTES
            router.post('/', userValidation.LoginValidation, this.postLogin);
            router.post('/signup', userValidation.SignUpValidation, this.postSignup);
        },
        
        indexPage: function(req, res){
            const errors = req.flash('error');
            return res.render('index', {
                title: 'WebChatApp | Login',
                messages: errors,
                hasErrors: errors.length > 0
            });
        },
        postLogin: passport.authenticate('localLogin', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp: function (req, res) {
            const errors = req.flash('error');
            return res.render('signup',{
                title: 'WebChatApp | SignUp',
                messages: errors,
                hasErrors: errors.length > 0
            });
        },
        postSignup: passport.authenticate('localSignup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read']
        }),
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        getInstagramLogin: passport.authenticate('instagram',{
            scope: ['profile']
        }),
        instagramLogin: passport.authenticate('instagram', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        homePage: function(req, res){
            return res.render('home');
        }

    }
}