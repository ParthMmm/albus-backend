const router = require("express").Router();
const UserModel = require("../models/User");

router.post("/fetchUserInfo", async (req, res, next) => {
  if (req.body.userID) {
    await UserModel.findById(req.body.userID)
      .then((result) => {
        const user = {
          _id: result._id,
          username: result.username,
          listened: result.listened,
          wantToListen: result.wantToListen,
          listening: result.listening,
          info: result.info,
        };
        console.log(user);
        // res.json(user);
        res.status(200).send(user);
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.send();
  }
});

router.post("latestActivity", async (req, res, next) => {
  if (req.body.userID) {
    await Us;
  }
});

module.exports = router;
