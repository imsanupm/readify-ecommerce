
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/user/userSchema');
// const passport = require('passport');
// const env = require('dotenv').config();

// passport.use(new GoogleStrategy({
//      clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback'
// },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             let user = await User.findOne({ googleId: profile.id })
//             if (user) {
//                 console.log(`existing user ${user}`)
//                 return done(null, user);
//             } else {
//                 user = new User({
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     googleId: profile.id,
//                 })
//                 await user.save();
//                 console.log(`new user saved${user}`)
//                 return done(null, user.id);
//             }
//         } catch (error) {
//             return done(error, null)

//         }
//     }
// ))

// passport.deserializeUser((id,done)=>{
//     User.findById(id)
//     .then(user=>{
//         done(null,user)
//     })
//     .catch(err=>{
//         done(err,null)
//     })
// })


// module.exports = {
//     passport
// }

const passport = require('passport');
const session = require('express-session')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user/userSchema');
require('dotenv').config(); // Load environment variables
passport.session({
  secret : process.env.SESSION_SECRET,
  resave:true,
  saveUniitialized:true,
})
console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET,'secret val')
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('auth progile',profile)
        let user = await User.findOne({ googleId: profile.id });
        console.log('found user',user)
        if (user) {
          console.log('Existing user:', user); // Debug
          return done(null, user); // Pass full user object
        } else {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
         // console.log('New user saved:', user); // Debug
          return done(null, user); // Pass full user object, not user.id
        }
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error, null);
      }
    }
  )
);

// Add serializeUser to store user._id in the session
passport.serializeUser((user, done) => {
 // console.log('Serializing user:', user); // Debug
  done(null, user._id); // Use MongoDB's _id
});

// Deserialize user from the session using the stored _id
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