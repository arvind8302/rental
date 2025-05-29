const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  // Clear existing listings
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6836aa96baee5a8bea61b29e",
  }));

  // Insert new listings from data.js
  await Listing.insertMany(initdata.data);
  console.log("Database initialized with sample listings.");
};
initDb();
