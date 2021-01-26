const Express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//Initialization
const app = Express();
require('./database');
require('./passport/local-auth');

//settings
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('port',process.env.PORT || 3000);

//middleware
app.use(morgan('dev')); 
app.use(Express.urlencoded({extended:false}));
app.use(session({
    secret: 'mysecretsession',
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Messages
app.use((req,res,next)=>{
    app.locals.signupMessage=req.flash('signupMessage');
    app.locals.signinMessage=req.flash('signinMessage');
    app.locals.supUser = req.user;
    next();
});
//Routes
app.use('/',require('./routes/index'));


//starting server
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});