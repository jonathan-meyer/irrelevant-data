const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const db = require("../models");

// Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "0",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "0",
      callbackURL: "/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("facebook", { profile });
      db.User.findOrCreate({
        where: { token: profile.id },
        defaults: {
          name: profile.displayName,
          provider: profile.provider,
          token: profile.id
        }
      })
        .then(([user]) => {
          done(null, user);
        })
        .catch(err => {
          done(err, null);
        });
    }
  )
);

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "0",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "0",
      callbackURL: "/auth/google/callback"
    },
    (token, tokenSecret, profile, done) => {
      console.log("google", { profile });
      db.User.findOrCreate({
        where: { token: profile.id },
        defaults: {
          name: profile.displayName,
          provider: profile.provider,
          token: profile.id
        }
      })
        .then(([user]) => {
          done(null, user);
        })
        .catch(err => {
          done(err, null);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

module.exports = function(app) {
  app.get("/auth/fb", passport.authenticate("facebook"));
  app.get("/auth/facebook", passport.authenticate("facebook"));
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: process.env.LANDING_PAGE || "/",
      failureRedirect: process.env.LOGIN_PAGE || "/"
    })
  );

  app.get("/auth/g", passport.authenticate("google", { scope: ["profile"] }));
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile"]
    })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: process.env.LANDING_PAGE || "/",
      failureRedirect: process.env.LOGIN_PAGE || "/"
    })
  );

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect(process.env.LANDING_PAGE || "/");
  });

  app.get("/auth/user", ({ user }, res) => {
    user === undefined
      ? res.status(401).json({ 401: "Unauthorized" })
      : res.json(user);
  });
};
