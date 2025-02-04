//29 mvc for reviews
const Listing = require("../models/listing") 
const Review = require("../models/reviews") 

module.exports.createReview = async(req,res)=>{
    let listing= await Listing.findById(req.params.id)   // accessing listing in reviews 
let newReview = new Review (req.body.review) //from reviews form in html
newReview.author = req.user._id;
console.log(newReview)
listing.reviews.push(newReview)

await newReview.save()
await listing.save()
req.flash("success","New Review Created !")
res.redirect (`/listings/${listing._id}`)
}

module.exports.deleteReview = async(req,res)=>{
let {id,reviewId}= req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})  //pull means to remove that in reviews which matches with review id dlt that 
await Review.findByIdAndDelete(reviewId)
req.flash("success","Review Deleted!")
res.redirect(`/listings/${id}`)
}