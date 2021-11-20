const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  reviewBody: {
    type: String,
    required: true,
  },
  album: {
    mbid: String,
    albumName: String,
    artist: String,
  },

  user: {
    _id: String,
    username: String,
  },

  datePosted: String,

  //   datePosted: String,
});

const ReviewModel = mongoose.model("reviews", reviewSchema);

module.exports = ReviewModel;
