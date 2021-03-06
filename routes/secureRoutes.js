const passport = require("passport");
const jwt = require("jsonwebtoken");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/User");
const ReviewModel = require("../models/Review");
const { ConnectionStates } = require("mongoose");
const router = require("express").Router();
// const dateFormat = require("dateformat");

var _ = require("lodash");

const checkAction = async (userID, mbID) => {
  let listened = false;
  let wantToListen = false;
  let listening = false;

  const checkListened = await UserModel.findById(userID, {
    listened: { $elemMatch: { mbid: mbID } },
  });
  const checkWantToListen = await UserModel.findById(userID, {
    wantToListen: { $elemMatch: { mbid: mbID } },
  });
  const checkListening = await UserModel.findById(userID, {
    listening: { $elemMatch: { mbid: mbID } },
  });

  if (checkListened != null) {
    if (!_.isEmpty(checkListened.listened)) {
      listened = true;
    }
  }
  if (checkWantToListen != null) {
    if (!_.isEmpty(checkWantToListen.wantToListen)) {
      wantToListen = true;
    }
  }
  if (checkListening != null) {
    if (!_.isEmpty(checkListening.listening)) {
      listening = true;
    }
  }
  const actions = {
    listened,
    wantToListen,
    listening,
  };
  console.log("check", actions);
  return actions;
};

router.get("/checkActions", async (req, res) => {
  const mbID = req.query.mbid;
  const userID = req.user._id;
  // const name = req.body.name;
  // const artist = req.body.artist;
  console.log(mbID, userID);
  const actions = await checkAction(userID, mbID);
  if (actions) {
    console.log("sent", actions);
    res.status(200).send(actions);
    return;
  }
  res.send(false);
  return;
});

router.get("/fetchUser", async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  const actions = {
    listened: user.listened,
    wantToListen: user.wantToListen,
    listening: user.listening,
  };

  const info = {
    info: user.info,
  };
  console.log(user.info);

  const freshInfo = { actions, info };
  res.status(200).send(freshInfo);
  return;
});

router.post("/updateInfo", async (req, res, next) => {
  const userID = req.user._id;
  const genre = req.body.genre;
  const artist = req.body.artist;
  const album = req.body.album;
  const spotify = req.body.spotify;
  const lastfm = req.body.lastfm;

  console.log(userID, genre, artist, album, spotify, lastfm);

  UserModel.findByIdAndUpdate(
    userID,
    {
      $set: {
        info: {
          genre: genre,
          artist: artist,
          album: album,
          spotify: spotify,
          lastfm: lastfm,
        },
      },
    },
    { new: true }
  ).then((result) => {
    res.status(200).send(result);
  });
});

router.post("/addListened", async (req, res, next) => {
  const mbID = req.body.mbid;
  const userID = req.user._id;
  const name = req.body.name;
  const artist = req.body.artist;

  console.log(mbID, name, artist);
  const actions = await checkAction(userID, mbID);
  console.log(actions);
  if (actions.listened) {
    console.log("pull listened");

    UserModel.findByIdAndUpdate(
      userID,
      {
        $pull: {
          listened: { mbid: mbID, albumName: name, artist: artist },
        },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
  } else if (actions.wantToListen) {
    //push and pull
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: { listened: { mbid: mbID, albumName: name, artist: artist } },
        $pull: {
          wantToListen: { mbid: mbID, albumName: name, artist: artist },
        },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push listened, pull wantToListen");
  } else if (actions.listening) {
    //push and pull
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: { listened: { mbid: mbID, albumName: name, artist: artist } },
        $pull: { listening: { mbid: mbID, albumName: name, artist: artist } },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });

    console.log("push listened, pull listening");
  } else {
    console.log("1111");
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: { listened: { mbid: mbID, albumName: name, artist: artist } },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push listened");
  }
  console.log(actions);
});

router.post("/addWantToListen", async (req, res, next) => {
  const mbID = req.body.mbid;
  const userID = req.user._id;
  const name = req.body.name;
  const artist = req.body.artist;

  const actions = await checkAction(userID, mbID);

  if (actions.wantToListen) {
    console.log("pull want to listen");

    UserModel.findByIdAndUpdate(
      userID,
      {
        $pull: {
          wantToListen: { mbid: mbID, albumName: name, artist: artist },
        },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
  } else if (actions.listened) {
    //push and pull
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: {
          wantToListen: { mbid: mbID, albumName: name, artist: artist },
        },
        $pull: { listened: { mbid: mbID, albumName: name, artist: artist } },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push wantToListen, pull listened");
  } else if (actions.listening) {
    //push and pull
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: {
          wantToListen: { mbid: mbID, albumName: name, artist: artist },
        },
        $pull: { listening: { mbid: mbID, albumName: name, artist: artist } },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push wantTolisten, pull listening");
  } else {
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: {
          wantToListen: { mbid: mbID, albumName: name, artist: artist },
        },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push wantToListen");
  }
});
router.post("/addListening", async (req, res, next) => {
  const mbID = req.body.mbid;
  const userID = req.user._id;
  const name = req.body.name;
  const artist = req.body.artist;

  const actions = await checkAction(userID, mbID);

  if (actions.listening) {
    console.log("pull listening");
    UserModel.findByIdAndUpdate(
      userID,
      {
        $pull: {
          listening: { mbid: mbID, albumName: name, artist: artist },
        },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
  } else if (actions.wantToListen) {
    //push and pull
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: { listening: { mbid: mbID, albumName: name, artist: artist } },
        $pull: {
          wantToListen: { mbid: mbID, albumName: name, artist: artist },
        },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push listening, pull wantToListen");
  } else if (actions.listened) {
    //push and pull
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: { listening: { mbid: mbID, albumName: name, artist: artist } },
        $pull: { listened: { mbid: mbID, albumName: name, artist: artist } },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push listening, pull listened");
  } else {
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: { listening: { mbid: mbID, albumName: name, artist: artist } },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
    console.log("push listening");
  }
});

router.post("/createReview", async (req, res, next) => {
  const rating = req.body.rating;
  const title = req.body.title;
  const reviewBody = req.body.reviewBody;
  const album = req.body.album;
  // console.log(req.body);
  console.log(req.body);

  const dateTime = new Date();

  const review = new ReviewModel({
    rating,
    title,
    reviewBody,
    album,
    user: req.user,
    datePosted: dateTime,
  });

  await ReviewModel.create(review), function (err) {};

  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        reviews: { id: review._id },
      },
    },
    { new: true }
  ).then((result) => {
    res.status(200).send();
  });

  console.log(review);
});
module.exports = router;
