const router = require("express").Router();
const ReviewModel = require("../models/Review");
const UserModel = require("../models/User");
const { ObjectId } = require("mongodb");
router.get("/fetchUserInfo", async (req, res, next) => {
  const userID = ObjectId(req.query.userID);
  console.log(userID);
  // res.send("pog");
  if (userID) {
    await UserModel.findById(userID)
      .then((result) => {
        const user = {
          _id: result._id,
          username: result.username,
          listened: result.listened,
          wantToListen: result.wantToListen,
          listening: result.listening,
          info: result.info,
          reviews: result.reviews,
        };
        // console.log(user);
        res.status(200).send(user);
      })
      .catch((error) => {
        // console.log(error);
        res.send(error);
      });
  }
  // await UserModel.findById(userID).then((result) => res.send(result));

  // res.send(userID);
  return;
});

router.get("/fetchAlbumReviews", async (req, res, next) => {
  const albumName = req.query.albumName;
  const artist = req.query.artist;

  if (albumName && artist) {
    await ReviewModel.find(
      {
        "album.albumName": albumName,
        "album.artist": artist,
      },
      (err, reviews) => {
        if (err) {
          return;
        }
        if (reviews.length) {
          res.status(200).send(reviews);
        } else {
          res.send(false);
        }
        return;
      }
    );
  }
});

router.get("/fetchUserReviews", async (req, res, next) => {
  const id = req.query.userID;
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
          res.status(200).send(reviews);
        }
        return;
      }
    );
  }
});

module.exports = router;
