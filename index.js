const connectToMongo = require("./db");
const express = require("express");
const check = require("./checkerFunctions/index");

connectToMongo();

const app = express();

const port = process.env.PORT || 5005;

// to have access to req object
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());

// route
app.use("/api/", require("./routes/index"));

app.get("/", (req, res) => {
  res.send("hello");
});
setInterval(check, 900000);
check();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
