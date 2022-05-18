const jwt = require("jsonwebtoken");
// we can use this middle ware where ever we want our user to be logged in

const secret = "$hivam";

const fetchuser = (req, res, next) => {
  // get the user the form the jwt token and add it to req object;

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "pls use valid authentication token" });
  }

  try {
    const data = jwt.verify(token, secret);
    console.log("data = ", data);
    req.id = data.id;
    next(); //will call the next middleware or the controller.
  } catch (error) {
    res.status(401).send({ error: "pls use valid authentication token" });
  }
};

module.exports = fetchuser;
