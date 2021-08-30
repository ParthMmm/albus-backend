const keys = require("./config/keys");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const MusicBrainzApi = require("musicbrainz-api").MusicBrainzApi;

require("./models/User");

require("./services/passport");
const mbRoute = require("./routes/mbRoutes");
const authRoute = require("./routes/authRoutes");
const secureRoute = require("./routes/secureRoutes");
// const fetchRoute = require("./routes/fetchRoutes");

mongoose.connect(keys.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

mongoose.connection.on("error", (error) => console.log(error));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", authRoute);
app.use("/api", mbRoute);

// const mbApi = new MusicBrainzApi({
//   appName: "my-app",
//   appVersion: "0.1.0",
//   appContactInfo: "user@mail.org",
// });

// async function hello() {
//   const recording = await mbApi.getRelease(
//     "0ace9b23-934d-4b58-a749-f0f33b883646"
//   );

//   console.log(recording);
// }

// console.log(hello());

// app.use("/api", fetchRoute);

// Plug in the JWT strategy as a middleware so only verified users can access this route.

app.use(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port} 🚀`));
