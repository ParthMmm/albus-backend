const passport = require("passport");
const jwt = require("jsonwebtoken");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const router = require("express").Router();

router.post("/signup", async (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
    try {
      if (err || !user) {
        res.status(201);
        res.send({ msg: info.message });
        return;
      }
      req.login(user, { session: true }, async (error, info) => {
        if (error || !user) {
          //   res.status(201);
          //   res.send(info.message); // return next(info.message);
          return next(error);
        }

        const body = {
          _id: req.user._id,
          username: req.user.username,
        };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        res.json({ id: body._id, username: body.username, token });
        return;
      });
    } catch (error) {
      return next(err);
    }
  })(req, res, next);
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        // res.status(404);
        res.status(201);
        res.send(info.message); // return next(info.message);
        return;
      }

      req.login(user, { session: true }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: req.user._id,
          username: req.user.username,
        };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        res.json({ token });
        return;
      });
    } catch (error) {
      return next(err);
    }
  })(req, res, next);
});

router.get("/current_user", (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.json({ user: req.user });
});

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
module.exports = router;
