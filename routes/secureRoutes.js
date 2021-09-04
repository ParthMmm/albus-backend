const passport = require("passport");
const jwt = require("jsonwebtoken");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/User");
const { ConnectionStates } = require("mongoose");
const router = require("express").Router();
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
  console.log(actions);
  return actions;
};

router.get("/fetchUser", async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  const actions = {
    listened: user.listened,
    wantToListen: user.wantToListen,
    listening: user.listening,
  };
  res.json({ actions });
  return;
});

router.post("/addListened", async (req, res, next) => {
  const mbID = req.body.mbid;
  const userID = req.user._id;
  const name = req.body.name;
  const artist = req.body.artist;

  console.log(mbID, name, artist);
  const actions = await checkAction(userID, mbID);
  if (actions.listened) {
    return;
  }

  if (actions.wantToListen) {
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
});

router.post("/addWantToListen", async (req, res, next) => {
  const mbID = req.body.mbid;
  const userID = req.user._id;
  const name = req.body.name;
  const artist = req.body.artist;

  const actions = await checkAction(userID, mbID);

  if (actions.wantToListen) {
    return;
  }

  if (actions.listened) {
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
    return;
  }

  if (actions.wantToListen) {
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
module.exports = router;
