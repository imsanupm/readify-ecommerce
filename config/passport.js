

const passport = require('passport');
const session = require('express-session')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user/userSchema');
require('dotenv').config(); 
passport.session({
  secret : process.env.SESSION_SECRET,
  resave:true,
  saveUniitialized:true,
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
       
        let user = await User.findOne({ googleId: profile.id });
      
       
        if (user) {
      
          return done(null, user);
        } else {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
        
          return done(null, user);
        }
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
 
  done(null, user._id); 
});


passport.deserializeUser(async (id, done) => {
  
  User.findById(id)
    .then((user) => {
     // console.log('Deserialized user:', user); // Debug
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

module.exports = { passport };