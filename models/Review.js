const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const reviewSchema = new Schema({
  mbid: {
    type: String,
  },
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

  user: {
    _id: String,
    username: String,
  },

  //   datePosted: String,
});

const ReviewModel = mongoose.model("reviews", reviewSchema);

module.exports = ReviewModel;
