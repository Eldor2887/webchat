const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const keys = require('./secret/secretFile');

const container = require('./container');


container.resolve(function(users, _, admin){
    mongoose.Promise = global.Promise;
    mongoose.connect(keys.mongoURI);
    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function () {
            console.log('Server is running on port 3000');
        });
        ConfigureExpress(app);
         // Setup router
         const router = require('express-promise-router')();
         users.SetRouting(router);
         admin.SetRouting(router);

         app.use(router);
    }

    function ConfigureExpress(app) {
        
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');
        require('./passport/passport-instagram');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.engine('handlebars', exphbs({
            defaultLayout: 'main'
        }));
        app.set('view engine', 'handlebars');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));

        app.use(validator());
        app.use(session({
            secret: 'thisismysecret',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }))
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        // Set Global vars
        app.use((req, res, next) => {
            res.locals.user = req.user || null;
            next();
        });
        // make lodash global
        app.locals._ = _;
    }
});