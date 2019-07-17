const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const db = require("../models");

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
  db.User.findOrCreate({
    where: { token: user.id },
    defaults: {
      name: user.displayName,
      provider: user.provider,
      token: user.id
    }
  })
    .then(([user, created]) => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = function(app) {
  app.get("/auth/fb", passport.authenticate("facebook"));

  app.get(
    "/auth/fb/callback",
    passport.authenticate("facebook", {
      successRedirect: "/login.html",
      failureRedirect: "/login.html"
    })
  );

  app.get("/auth/user", ({ user }, res) => {
    user === undefined
      ? res.status(401).json({ 401: "Unauthorized" })
      : res.json(user);
  });

  app.post("/auth/user", (req, res) => {
    res.status(501).json({ 501: "Not Implemented" });
  });
};
