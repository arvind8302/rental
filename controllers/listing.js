const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
};

module.exports.rendernewform = (req, res) => {
  res.render("listings/new");
};

module.exports.showlisting = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};
module.exports.createListing = async (req, res) => {
  let response = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  if (!response.body.features.length) {
    req.flash("error", "Invalid location");
    return res.redirect("/listings/new");
  }

  const { listing } = req.body;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else {
    newListing.image = {
      url: "https://via.placeholder.com/300",
      filename: "default-image",
    };
  }

  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect(`/listings`);
};


module.exports.rendereditform = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_250");

  res.render("listings/edit", { listing, originalImage });
};

module.exports.updatelisting = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
    runValidators: true,
  });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroylisting = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
