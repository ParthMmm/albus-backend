const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//Hash user passwords before saved in db
userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10); //Salt round to 10

  this.password = hash;
  next();
});

//Check if password exists
userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
