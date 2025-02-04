const Listing = require("../models/listing")
const Review= require("../models/reviews")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("../schema.js")  // helps to validate our schema handle error of schema

//25 function to connect login route to add or edit listings
module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl
        req.flash("error","You must be logged in to create listing!")
      return  res.redirect("/login")
    } 
    next() 
}

//27 post login page
module.exports.saveRedirectUrl = (req,res,next)=>{
  if (req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next()
}
// 28 Authorization for listing edit/dlt
module.exports.isOwner = async (req,res,next)=>{
  let {id}= req.params;
let listing = await Listing.findById(id)
if (!listing) {
  req.flash("error", "Listing not found");
  return res.redirect("/listings");
}
if (!listing.owner._id.equals(res.locals.currUser._id)){
  req.flash("error","you are not the owner of this listing ")
   return res.redirect (`/listings/${id}`)
}
next()
}



//Validation  17.4
module.exports.validateListing = async (req,res,next)=>{
  let {error} = listingSchema.validate(req.body); // Joi schema validator (conditions satisfying in schema) 
if (error){
  let errMsg = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
  }else {
      next()
  }
}

//18.3
module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body); // Joi schema validator (conditions satisfying in schema) 
if (error){
  let errMsg = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
  }else {
      next()
  }
}

// 28 Authorization for review edit/dlt
module.exports.isReviewAuthor = async (req,res,next)=>{
  let {id,reviewId}= req.params;
let review = await Review.findById(reviewId)
if (!review.author.equals(res.locals.currUser._id)) {
  req.flash("error", "You are not the author of this review");
  return res.redirect(`/listings/${id}`);
}

next();
};



