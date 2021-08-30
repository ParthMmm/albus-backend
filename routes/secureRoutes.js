const passport = require("passport");
const jwt = require("jsonwebtoken");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/User");
const { ConnectionStates } = require("mongoose");
const router = require("express").Router();

router.post("/addListened", async (req, res, next) => {
  const body = Object.keys(req.body).toString();
  console.log(body);
  console.log(req.user._id);
  const id = req.user._id;

  UserModel.findByIdAndUpdate(
    id,
    {
      $push: { listened: { mbid: body } },
    },
    { new: true }
  ).then((result) => {
    res.status(200).send(result);
  });
});

module.exports = router;
