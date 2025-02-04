//20 restructring reviews
const express = require("express")
const router = express.Router({ mergeParams : true})
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/reviews.js")
const Listing = require( "../models/listing.js"); //from listing.js
const {validateReview,isLoggedIn,isReviewAuthor}=require("./middleware.js")
//18.2 Reviews Post route (one to many relation )18.0 define review scema im models (reviews.js)18.1 in create review form , 18.3 for validate review err handle ,18.4 display review in show.ejs

const reviewController = require("../controllers/reviews.js")
 const review = require("../models/reviews.js")
//post review route
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview))

//18.6 dlt review route
router.delete("/:reviewId",
   isLoggedIn,
   isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
)
module.exports = router
