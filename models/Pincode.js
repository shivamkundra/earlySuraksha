const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PincodeSchema = new Schema({
  pincode: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: "",
  },
  food: {
    type: Number,
    default: 0,
  },
  shelter: {
    type: Number,
    default: 0,
  },
  medicalStaff: {
    type: Number,
    default: 0,
  },
  loc: {
    lat: {
      type: Number,
      default: 0,
    },
    long: {
      type: Number,
      default: 0,
    },
  },
});

const Pincode = mongoose.model("pincode", PincodeSchema);
// User.createIndexes(); //prevents duplicate value
module.exports = Pincode;
