const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const user = require('../models/user');
var privada;

passport.serializeUser((us,done)=>{
    done(null,us.id);
});

passport.deserializeUser(async (id,done)=>{
    const us = await user.findById(id);
    done(null,us);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
 }, async (req,email,password,done)=>{

    //email validation
    const searchUsr = await user.findOne({email:email});
    if(searchUsr){
        done(null,false,req.flash('signupMessage','Email already exists'));
    }else{

    const newUser = new user();
    newUser.email = email;
    //password cypher
    newUser.password = newUser.encryptPassword(password);
    

    //console.log(otro.publicKey);
    //console.log(genKeys.privateKey);
    //user register
    await newUser.save();
    
    done(null,newUser);
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
},async (req,email,password,done)=>{
    const logUsr = await user.findOne({email:email});
    if(!logUsr){
        return done(null, false,req.flash('signinMessage','User Not Found'));
    }

    if(!logUsr.comparePassword(password)){
        return done(null, false,req.flash('signinMessage','Incorrect Password'));
    }

    done(null,logUsr);

}));

