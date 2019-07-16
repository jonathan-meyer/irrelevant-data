const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

//const db = require("../models");

// Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/fb/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      // todo: get user from the database or create a new record
      cb && cb(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser", { user });
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserializeUser", { user });
  done(null, user);
});

module.exports = function(app) {
  app.get("/auth/fb", passport.authenticate("facebook"));

  app.get(
    "/auth/fb/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login.html"
    })
  );
};
