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

router.post("/MessagesToUsers", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    users = await User.find({ pincode: req.body.pin });

    console.log(users + "userrrrrrrrrr");
    for (user of users) {
      sendSms(user, req.body.msg);
    }

    res.json({
      messages: "msg sent to users",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});
const sendSms = (user, msg) => {
  if (user.phoneNumber == undefined) return;

  const accountSid = "AC5b21300807fd268f1c96c14b60ba4405";
  const authToken = "1c078e477da5245e8250a4808ad9e452";
  const client = require("twilio")(accountSid, authToken);
  const mobileNumber = "+91" + user.phoneNumber;
  console.log(mobileNumber);
  client.messages
    .create({
      body: `Message from NDRF ${msg}`,
      from: "+13027860883",
      to: mobileNumber,
    })
    .then((message) => console.log("msgid", message.sid))
    .catch((err) => {
      console.log("err", err);
    })
    .done();
};

module.exports = router;
