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
        };
        console.log(user);
        // res.json(user);
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(401).send();
  }
});

module.exports = router;
