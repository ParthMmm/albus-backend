const router = require("express").Router();
const ReviewModel = require("../models/Review");
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
        // console.log(user);
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

router.get("/fetchAlbumReviews", async (req, res, next) => {
  const albumName = req.query.albumName;
  const artist = req.query.artist;
  const mbid = req.body.mbid;
  if (albumName && artist) {
    await ReviewModel.find({
      "album.albumName": albumName,
      "album.artist": artist,
    })
      .then((result) => {
        console.log(result);
        res.status(200).send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }
});

module.exports = router;
