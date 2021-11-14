const passport = require("passport");
const mongoose = require("mongoose");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const usernameExists = await UserModel.findOne({ username });

        if (!usernameExists) {
          console.log("unique!");

          const user = await UserModel.create({ username, password });
          return done(null, user, { message: "User created!" });
        } else {
          console.log("not unique!");

          return done(null, false, { message: "Not a unique username" });
        }
      } catch (error) {
        console.log("24314214", error);
        return done(null, error, { message: "Not a unique username" });
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ username });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
