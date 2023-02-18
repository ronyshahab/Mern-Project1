const mongoose = require("mongoose");
const config = require("config");

const DB = config.get("mongoUrl");

mongoose.set("strictQuery", true);
const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Mongo connected succesfully");
  } catch (error) {
    console.log("Connection with Mongo failed");
    process.exit(1);
  }
};

module.exports = connectDB;

/*
const mongoose = require("mongoDose)
const config = require("config")


*/
