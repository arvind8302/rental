const Listing = require("./models/listing");
const { listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema } = require("./schema");
const Review = require("./models/review");





module.exports.isLoggedin = (req,res,next) =>{ 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in to create a new listing!");
    return res.redirect("/login");
  }

next();

}

module.exports.saveRedirectUrl =(req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
};


module.exports.isOwner = async (req,res,next) => {
     const { id } = req.params;
    
    const existingListing = await Listing.findById(id);
    if (!existingListing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of the listing");
       return res.redirect(`/listings/${id}`);
    } 
    next();
};
// Middleware to validate listing
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};

// Middleware to validate review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};



module.exports.isReviewAuthor = async (req,res,next) => {
     const { id,reviewid } = req.params;
    
    const existingReview = await Review.findById(reviewid);
    if (!existingReview.author.equals(res.locals.currUser._id)){
      req.flash("error","You did not create this review");
       return res.redirect(`/listings/${id}`);
    } 
    next();
};