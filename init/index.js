//8 requiring things from  data.js and listing.js(models)
const mongoose= require("mongoose")
const initData = require ("./data.js")  //sample data for our listings schema
const Listing = require( "../models/listing.js")  // listings schema 


main()
.then(()=>{
    console.log("connected to DB ")
})
.catch(err=>{console.log(err)})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

//9 function for initializing db

const initDB = async () => {
    const existingUserId = '66dc5e07c7ee849435047b50'; // Use the valid ObjectId from the query above
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: existingUserId
    }));

   
    await Listing.insertMany(initData.data);
    console.log("data was initialized with an existing user");
  };
  
  initDB();

  





