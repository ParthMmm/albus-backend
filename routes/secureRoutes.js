const passport = require("passport");
const jwt = require("jsonwebtoken");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/User");
const { ConnectionStates } = require("mongoose");
const router = require("express").Router();

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

  console.log(checkListened);
  console.log(checkWantToListen);
  console.log(checkListening);
  console.log(checkListened.listened);
  if (checkListened != null) {
    if (checkListened.listened != "") {
      listened = true;
    }
  }
  console.log(listened);
  return listened;
};

router.post("/addListened", async (req, res, next) => {
  const mbID = Object.keys(req.body).toString();
  const userID = req.user._id;
  let tmp = await checkAction(userID, mbID);
  if (!tmp) {
    UserModel.findByIdAndUpdate(
      userID,
      {
        $push: { listened: { mbid: mbID } },
      },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
  }
});

module.exports = router;
