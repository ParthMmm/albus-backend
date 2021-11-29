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
    await ReviewModel.find(
      {
        "album.albumName": albumName,
        "album.artist": artist,
      },
      (err, reviews) => {
        if (err) {
          console.log(err);
          return;
        }
        if (reviews.length) {
          console.log(reviews);

          res.status(200).send(reviews);
        }
        return;
      }
    );
  }
});

router.get("/fetchUserReviews", async (req, res, next) => {
  // console.log(req.user);
  const id = req.query.id;
  console.log(id);
  if (id) {
    await ReviewModel.find(
      {
        "user._id": id,
      },
      (err, reviews) => {
        if (err) {
          return;
        }
        if (reviews.length) {
          // console.log(reviews);
          res.status(200).send(reviews);
        }
        return;
      }
    );
  }
});

module.exports = router;
