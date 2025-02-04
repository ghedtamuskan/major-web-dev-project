//5  requrire mongoose and make schema and collection name listings
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review = require("./reviews.js")


const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },

    description: String,

    image: {
    url: String,
    filename : String,
    },
    price: Number,
    location: String,
    country: String,
    
    reviews :[
      {
        type : Schema.Types.ObjectId,   //type is objectId
        ref:"Review"
      }
    ],
    owner:{
      type : mongoose.Schema.Types.ObjectId,
      ref: "User",
    
    },
    geometry :{
      type:{
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false
          },
          coordinates: {
            type: [Number],
            required: false
          }
      },
    
    
  });

  //18.7 [Handling delete listing] if listing dlt then after review object id also dlt
  listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
         await Review.deleteMany({_id:{ $in: listing.reviews}})
   }
  })


const Listing = mongoose.model("Listing",listingSchema)  //model name listings
module.exports = Listing;

