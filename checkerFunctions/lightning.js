const axios = require("axios");
const User = require("../models/User");
const Nodemailer = require("nodemailer");
const Pincode = require("../models/Pincode");

const checkLightning = async () => {
  // console.log("checking for lightning");
  try {
    states = [
      "frankfort",
      "Assam",
      "Bihar",
      //   "Chhattisgarh",
      //   "Goa",
      "Gujarat",
      //   "Haryana",
      //   "Himachal Pradesh",
      //   "Jharkhand",
      //   "Karnataka",
      "Kerala",
      //   "Madhya Pradesh",
      //   "Maharashtra",
      //   "Manipur",
      //   "Meghalaya",
      //   "Mizoram",
      //   "Odisa",
      //   "Punjab",
      //   "Rajasthan",
      //   "Sikkim",
      //   "Telangana",
      //   "Tripura",
      //   "Uttar Pradesh",
      //   "West Bengal",
      //   "Chandigarh",
      //   "Jammu and Kashmir",
      //   "Ladakh",
      //   "Lakshadweep",
      //   "Puducherry",
    ];

    lightiningProneArea = [];

    for (const state of states) {
      let res = await axios.get(
        `https://api.aerisapi.com/lightning/${state},in?format=json&filter=cg&limit=10&client_id=Yo7yrZD0VM43e7Vf3CR2I&client_secret=E7hF7B34mNnFpF6yYviy0q39n8YpBestpzaMiYQS`
      );
      let { response } = res.data;
      console.log(response);
      Array.prototype.push.apply(lightiningProneArea, response);
      // Array.prototype.push.apply(lightiningProneArea, [1]);
    }
    console.log(lightiningProneArea);
    fetchPostCode(lightiningProneArea);
  } catch (err) {
    console.log(err);
  }
};

const fetchPostCode = async (response) => {
  // postCodes = []; // test purpose
  try {
    const ownData = [
      {
        loc: {
          lat: 28.6665923,
          long: 77.2586003,
        },
      },
      {
        loc: {
          lat: 23.1612548,
          long: 72.6600189,
        },
      },
      {
        loc: {
          lat: 23.1611713,
          long: 72.6592798,
        },
      },
      {
        loc: {
          lat: 23.1593522,
          long: 72.6646141,
        },
      },
    ];

    response = response.concat(ownData);

    postCodes = ["201206"];

    console.log(response);

    for (const position of response) {
      let res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${position.loc.lat}+${position.loc.long}&key=713c94f1ac8d447ca086c5ce103fbe81&pretty=1`
      );
      const data = res.data.results[0].components.postcode;

      const pincodeInDb = await Pincode.findOne({ pincode: data });
      // console.log(pincodeInDb);
      if (pincodeInDb == null) {
        //not added in database
        // new case found
        try {
          await Pincode.create({
            pincode: data,
            city: res.data.results[0].components.city,
            state: res.data.results[0].components.state,
            loc: {
              lat: position.loc.lat,
              long: position.loc.long,
            },
          });
        } catch (err) {
          console.log(err);
        }
      }

      if (!postCodes.includes(data) && data !== undefined) {
        postCodes.push(data);
      }
    }

    console.log(postCodes);

    findUsers(postCodes);
  } catch (err) {
    console.log(err);
  }
};

const findUsers = async (postCodes) => {
  try {
    for (const postcode of postCodes) {
      // fetch user with this particular postcode and send them message

      const Users = await User.find({ pincode: postcode }); // all users with the pincodes under danger

      for (const user of Users) {
        alertUser(user); // alerting every user under danger
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const alertUser = (user) => {
  // email
  // sms
  // notification

  sendSms(user);
  sendEmail(user);
  console.log("smoke : ACTIVATED");
};

const sendEmail = (user) => {
  const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "earlysuraksha@gmail.com", // generated ethereal user
      pass: "ombdmgkzmlrfmlzv", // generated ethereal password
    },
  });

  let mailOption = {
    from: "earlysuraksha@gmail.com",
    to: user.email,
    subject: "Lightning Alert !!!",
    html: "<div><h1>Early Suraksha at Rescue</h1><p>This is to inform you that our system has detected severe lightning conditions in your postal region kindly take precautionary steps</p></div>",
  };

  transporter.sendMail(mailOption, (err, data) => {
    if (err) {
      console.log("err", err);
    } else {
      console.log("sent");
    }
  });
};
const sendSms = (user) => {
  if (user.phoneNumber == undefined) return;

  const accountSid = "AC8619ae3a399eb4c088b0cb6d0baed0cf";
  const authToken = "c261a1b1bd8eb4d60a0118a1d763fb01";
  const client = require("twilio")(accountSid, authToken);
  const mobileNumber = "+91" + user.phoneNumber;
  console.log(mobileNumber);
  client.messages
    .create({
      body: "This is to inform you that our system has detected severe lightning conditions in your postal region kindly take precautionary steps",
      from: "+14244597566",
      to: mobileNumber,
    })
    .then((message) => console.log("msgid", message.sid))
    .catch((err) => {
      console.log("err", err);
    })
    .done();
};

module.exports = checkLightning;
