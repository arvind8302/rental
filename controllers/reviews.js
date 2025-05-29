const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError("Listing Not Found", 404);

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  await newReview.save();
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "Review added successfully!");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
