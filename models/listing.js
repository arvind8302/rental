// models/listing.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review"); // Import Review model
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {  
    type: String,
    required: true
  },
  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default: "https://unsplash.com/photos/a-tree-grows-through-an-open-structure-ceTCuQXbSn8",
      set: v =>
        v === "" ? "https://unsplash.com/photos/a-tree-grows-through-an-open-structure-ceTCuQXbSn8" : v
    }
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref : "User",
  },
  geometry: {
    type: {
      type:String,
      enum : ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }

  },
});


listingSchema.post("findOneAndDelete", async (listing)  => {
  // Delete all reviews associated with the listing
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
