const express = require("express");
const res = require("express/lib/response");
const Pincode = require("../models/Pincode");
const { body, validationResult } = require("express-validator");
const { json } = require("express");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");

const router = express.Router();

router.get("/isDanger", fetchuser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    const userid = req.id;
    console.log(userid);
    const user = await User.findById(userid).select("-password");
    const pincodeInDb = await Pincode.findOne({ pincode: user.pincode });
    if (pincodeInDb) {
      // present in out database
      return res.json({
        msg: true,
      });
    }
    res.json({
      msg: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

router.get("/getAllDanger", fetchuser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    const pincodesInDb = await Pincode.find({});

    res.json({
      data: pincodesInDb,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
