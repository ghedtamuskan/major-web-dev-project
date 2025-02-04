//19 Express Router Restructuring lisitng
const express = require("express")
const router = express.Router()
const Listing = require( "../models/listing.js"); //from listing.js
const wrapAsync = require("../utils/wrapAsync.js")
const{isLoggedIn,isOwner,validateListing} = require("../routes/middleware.js")//25
const listingController = require("../controllers/listings.js") //29 MVC 
const multer = require('multer')   // help to handle/parse form data i.e uploading files 31
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})
  
// index and create route
router.route("/")   //30 router.route compact way to write same path req. code
.get (wrapAsync(listingController.index))  //  10 Get route index
.post (isLoggedIn,   //14 Route to save create entered data of create route
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);


// 12 Create : new and create route    ,, CRUD first create otherwise error
router.get("/new",isLoggedIn,(listingController.renderNewForm))
 
//show ,update,delete route
router.route ("/:id")
.get(wrapAsync(listingController.showListing) ) //13 read : show route  (to show data of all links)
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),   //32
    validateListing,
    wrapAsync (listingController.updateListing))  //update entered listing data
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing)  //16 delete route
)

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
)
module.exports = router

