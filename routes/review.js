const express = require("express");
const router = express.Router({ mergeParams: true }); // need mergeParams to access :id from parent router
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews.js");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");

// CREATE Review — POST /listings/:id/reviews
router.post(
  "/", // just "/", because base is /listings/:id/reviews
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE Review — DELETE /listings/:id/reviews/:reviewId
router.delete(
  "/:reviewId", // just "/:reviewId"
  isLoggedin,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
