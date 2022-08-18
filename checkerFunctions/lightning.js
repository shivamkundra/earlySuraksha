const axios = require("axios");
const User = require("../models/User");
const Nodemailer = require("nodemailer");
const Pincode = require("../models/Pincode");

const checkLightning = async () => {
  // console.log("checking for lightning");

  states = [
    "frankfort",
    "Assam",
    "Bihar",
    //   "Chhattisgarh",
    //   "Goa",
    //   "Gujarat",
    //   "Haryana",
    //   "Himachal Pradesh",
    //   "Jharkhand",
    //   "Karnataka",
    //   "Kerala",
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

  // for (const state of states) {
  //   // console.log(state);
  //   axios
  //     .get(
  //       `https://api.aerisapi.com/lightning/closest?p=${state},&format=json&radius=25mi&filter=cg&limit=10&client_id=6wJ8dxYssvfjq6PCcvTNz&client_secret=PWiVGCBdVm5tw5nKAbQYESUGq4zoHnOZiSR6hKZW`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const data = response.data.response;
  //       Array.prototype.push.apply(lightiningProneArea, data);
  //       // console.log(state, response.data.success, data);
  //       console.log("lpa", lightiningProneArea);
  //       fetchPostCode(lightiningProneArea);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  // for (const state of states) {
  //   let res = await axios.get(
  //     `https://api.aerisapi.com/lightning/closest?p=${state},&format=json&radius=25mi&filter=cg&limit=10&client_id=6wJ8dxYssvfjq6PCcvTNz&client_secret=PWiVGCBdVm5tw5nKAbQYESUGq4zoHnOZiSR6hKZW`
  //   );
  //   let { response } = res.data;
  //   console.log(response);
  //   Array.prototype.push.apply(lightiningProneArea, response);
  // Array.prototype.push.apply(lightiningProneArea, [1]);
  // }
  console.log(lightiningProneArea);
  fetchPostCode(lightiningProneArea);
};

const fetchPostCode = async (response) => {
  // postCodes = []; // test purpose

  response = [
    {
      loc: {
        lat: 28.6665923,
        long: 77.2586003,
      },
    },
  ];
  postCodes = [201206];
  console.log(response);

  // for (const position of response) {
  //   axios
  //     .get(
  //       `https://api.opencagedata.com/geocode/v1/json?q=${position.loc.lat}+${position.loc.long}&key=713c94f1ac8d447ca086c5ce103fbe81&pretty=1`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then(async (response) => {
  //       const data = response.data.results[0].components.postcode;

  //       if (!postCodes.includes(data) && data !== undefined) {
  //         postCodes.push(data);
  //         console.log(postCodes[cnt]);
  //         findUsers(postCodes);
  //         cnt++;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

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
};

const findUsers = async (postCodes) => {
  for (const postcode of postCodes) {
    // fetch user with this particular postcode and send them message

    const Users = await User.find({ pincode: postcode }); // all users with the pincodes under danger

    for (const user of Users) {
      alertUser(user); // alerting every user under danger
    }
  }
};

const alertUser = (user) => {
  // email
  // sms
  // notification

  sendSms(user);
  sendEmail(user);
  sendNotification(user);
};

const sendEmail = (user) => {
  const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "earlysuraksha@gmail.com", // generated ethereal user
      pass: "earlysuraksha", // generated ethereal password
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
  const accountSid = "AC389ca20125022b31ed4335a9c8da9405";
  const authToken = "f9786658221cf145e896548815507c31";
  const client = require("twilio")(accountSid, authToken);
  const mobileNumber = "+91" + user.phoneNumber;
  console.log(mobileNumber);
  client.messages
    .create({
      body: "This is to inform you that our system has detected severe lightning conditions in your postal region kindly take precautionary steps",
      from: "+19894184325",
      to: mobileNumber,
    })
    .then((message) => console.log("msgid", message.sid))
    .catch((err) => {
      console.log("err", err);
    })
    .done();
};
const sendNotification = (user) => {};
module.exports = checkLightning;
