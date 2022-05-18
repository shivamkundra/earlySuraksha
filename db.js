const mongoose = require("mongoose");
// const mongoURI = "mongodb://localhost:27017/attendanceSystem";
const mongoURI =
  "mongodb+srv://shivamkundra:8826609487@cluster0.1ggr4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected to mongo");
  });
};
module.exports = connectToMongo;
