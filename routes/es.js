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
    // console.log(pincodeInDb);
    console.log("|");
    console.log("|");
    console.log("|");
    console.log("|");
    console.log("|");

    if (pincodeInDb) {
      console.log("lat : " + pincodeInDb.loc.lat);
      console.log("long : " + pincodeInDb.loc.long);
      // present in out database
      console.log("Danger ---> " + true);
      console.log("SMS sent");
      console.log("User Notified");

      console.log("|");
      console.log("|");
      console.log("|");
      console.log("|");
      console.log("|");
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

  const accountSid = "AC5e735e124400e328513563a76dda225b";
  const authToken = "35d46f14517c4d20bba9979f629ab30d";
  const client = require("twilio")(accountSid, authToken);
  const mobileNumber = "+91" + user.phoneNumber;
  console.log(mobileNumber);
  client.messages
    .create({
      body: `Message from NDRF ${msg}`,
      from: "+18159575597",
      to: mobileNumber,
    })
    .then((message) => console.log("msgid", message.sid))
    .catch((err) => {
      console.log("err", err);
    })
    .done();
};

router.post("/alertPolice", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    await Pincode.updateOne(
      { pincode: req.body.pin },
      {
        $set: {
          policeStation: true,
        },
      }
    );

    res.json({
      msg: "police alerted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

router.post("/alertMedical", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    await Pincode.updateOne(
      { pincode: req.body.pin },
      {
        $set: {
          medical: true,
        },
      }
    );

    res.json({
      msg: "medical staff alerted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

router.get("/alertedHospitals", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    hospitals = await Pincode.find({ medical: true });

    res.json({
      data: hospitals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

router.get("/alertedPolice", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //if the values are not entered as per the rules the error will be sent
  }

  try {
    police = await Pincode.find({ policeStation: true });

    res.json({
      data: police,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
