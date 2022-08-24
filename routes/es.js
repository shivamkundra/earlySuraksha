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

router.get("/getAllDanger", async (req, res) => {
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

router.post("/deletePin", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    const pincode = req.body.pin;

    const delpin = await Pincode.findOneAndDelete({ pincode: pincode });

    res.json({
      data: delpin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

router.post("/sendMessageUser", fetchuser, async (req, res) => {
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
      messages = pincodeInDb.messages;

      messages.push(req.body.msg);

      await Pincode.updateOne(
        { pincode: user.pincode },
        {
          $set: {
            messages: messages,
          },
        }
      );
    } else {
      return res.json({
        msg: "You do not have access",
      });
    }

    res.json({
      msg: "Your message is delivered to NDRF",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

router.post("/MessagesFromUsers", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    pincodeInDb = await Pincode.findOne({ pincode: req.body.pin });

    res.json({
      messages: pincodeInDb.messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
