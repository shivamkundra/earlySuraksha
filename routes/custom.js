const express = require("express");
const res = require("express/lib/response");

const router = express.Router();

router.post("/sendAlert", (req, res) => {
  const accountSid = "AC389ca20125022b31ed4335a9c8da9405";
  const authToken = "f9786658221cf145e896548815507c31";
  const client = require("twilio")(accountSid, authToken);
  const mobileNumber = req.body.number;
  client.messages
    .create({
      body: "alert severe lightning ",
      from: "+19894184325",
      to: `+91${mobileNumber}`,
    })
    .then((message) => console.log(message.sid))
    .done();

  res.send({
    message: "message sent",
  });
});

module.exports = router;
