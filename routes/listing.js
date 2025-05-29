const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing");
const { reviewSchema } = require("../schema"); // in review.js // in listing.js
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js")
const upload = multer({storage});


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );
  

  // NEW
router.get("/new", isLoggedin, listingController.rendernewform);

router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isLoggedin,
    isOwner,
     upload.single("listing[image]"),
    validateListing,

    wrapAsync(listingController.updatelisting)
  )
  .delete(isLoggedin, isOwner, wrapAsync(listingController.destroylisting));


// EDIT
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.rendereditform)
);

module.exports = router;
