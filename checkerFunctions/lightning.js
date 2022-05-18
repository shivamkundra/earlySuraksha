const axios = require("axios");
const User = require("../models/User");
const checkLightning = async () => {
  // console.log("checking for lightning");

  states = [
    "frankfort",
    //   "Assam",
    //   "Bihar",
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

  for (const state of states) {
    // console.log(state);
    axios
      .get(
        `https://api.aerisapi.com/lightning/closest?p=${state},&format=json&radius=25mi&filter=cg&limit=10&client_id=6wJ8dxYssvfjq6PCcvTNz&client_secret=PWiVGCBdVm5tw5nKAbQYESUGq4zoHnOZiSR6hKZW`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data.response;
        Array.prototype.push.apply(lightiningProneArea, data);
        // console.log(state, response.data.success, data);
        console.log("lpa", lightiningProneArea);
        fetchPostCode(lightiningProneArea);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

const fetchPostCode = async (response) => {
  postCodes = [];
  console.log(response);

  for (const position of response) {
    axios
      .get(
        `https://api.opencagedata.com/geocode/v1/json?q=${position.loc.lat}+${position.loc.long}&key=713c94f1ac8d447ca086c5ce103fbe81&pretty=1`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        const data = response.data.results[0].components.postcode;
        if (!postCodes.includes(data) && data !== undefined) {
          postCodes.push(data);
          console.log(postCodes);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // findUsers(postCodes);
};

const findUsers = (postCodes) => {
  for (const postcode of postCodes) {
    // fetch user with this particular postcode and send them message

    const Users = User.find({ pincode: postcode });
    for (const user of Users) {
      alertUser(user);
    }
  }
};
const alertUser = (user) => {
  // email
  // sms
  //notification

  sendEmail(user);
  sendSms(user);
  sendNotification(user);
};

const sendEmail = (user) => {};
const sendSms = (user) => {};
const sendNotification = (user) => {};
module.exports = checkLightning;
