// 29 MVC controller for backend code
const Listing = require("../models/listing") 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');  //32 mapbox functionality
  const mapToken = process.env.MAP_TOKEN;
  const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index =  async(req,res)=>{
        const allListings = await Listing.find({})  
        res.render("./listings/index.ejs",{allListings})
    }
    module.exports.renderNewForm = (req,res)=>{
        res.render("./listings/new.ejs")
     }

   module.exports.showListing= async(req,res)=>{
        let {id}= req.params;
        const listing = await Listing.findById(id).populate('owner')
        .populate({
            path:"reviews",
            populate:{
                path:"author"
            }
        })       //populate to get review object ID data
        .populate("owner")

       if(!listing){
            req.flash("error","listing you requested does not exist!")
            res.redirect("/listings")
        }
    res.render("./listings/show.ejs",{
        listing,
           MAP_TOKEN: process.env.MAP_TOKEN   // ✅ Pass Mapbox token to EJS
        
    })
    }

    module.exports.createListing=async(req,res,next)=>{    //32 geocoding
     let response = await geocodingClient
     .forwardGeocode({
        query : req.body.listing.location,
        limit : 1
     })
     .send()

        let url = req.file.path;
        let filename = req.file.filename;     //31 edit image listing
       const newListing = new Listing(req.body.listing)
            newListing.owner = req.user._id;
            newListing.image = {url,filename}
            newListing.geometry = response.body.features[0].geometry
            let savedListing = await newListing.save();
            console.log(savedListing)
             req.flash("success","New listing Created!")
           res.redirect("/listings");
    }

       module.exports.renderEditForm=async(req,res)=>{
        let {id}= req.params;
        let listing = await Listing.findById(id)
        if(!listing){
            req.flash("error","listing you requested does not exist!")
            res.redirect("/listings")
        }
        // let originalImageUrl= listing.image?.url ||'';
        // if (originalImageUrl)
        
        let originalImageUrl = listing.image?.url.includes('cloudinary.com')
        ? listing.image.url
        : `http://your-old-url-path/${listing.image?.url || listing.image}`;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

        res.render("./listings/edit.ejs",{listing,originalImageUrl})
    }

    module.exports.updateListing=async(req,res)=>{
        let {id}= req.params;
         let listing= await Listing.findByIdAndUpdate(
          id,{...req.body.listing}
        )
        if ( typeof req.file !=="undefined"){ //32 edit listing image through file parsing
        let url = req.file.path;     
        let filename = req.file.filename; 
        listing.image = {url,filename}

         // Preserve the old image URL if no new image is uploaded
         listing.image = listing.image?.url.includes('cloudinary.com')
         ? listing.image
         : `http://your-old-url-path/${listing.image?.url || listing.image}`;
 }
        await listing.save()
        req.flash("success","Listing Updated")
        res.redirect(`/listings/${id}`)     
}
       
        module.exports.destroyListing = async(req,res)=>{
            let {id} = req.params;             //extracting id
           let deletedListing= await Listing.findByIdAndDelete(id);
           console.log(deletedListing)
           req.flash("success","Listing Deleted!")
           res.redirect("/listings")
    
        }










