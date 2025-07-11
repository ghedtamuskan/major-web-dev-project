//8 requiring things from  data.js and listing.js(models)
const dotenv = require("dotenv"); 
dotenv.config();                  

const mongoose= require("mongoose")
const initData = require ("./data.js")  //sample data for our listings schema
const Listing = require( "../models/listing.js")  // listings schema 
const User = require("../models/user.js"); // ✅ Required now
  

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("✅ Connected to MongoDB Atlas");
}


//9 function for initializing db

const initDB = async () => {
  try {
    // 🧹 Delete old users and listings
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log("🗑️ Old users and listings deleted");

    // 👤 Create new test user
    const user = new User({
      email: "muskan@example.com",
      username: "muskan",
    });
    await user.save();
    console.log("👤 Test user created:", user.username);

    // 📦 Add owner's ID to each listing
    const listingsWithOwner = initData.data.map((listing) => ({
      ...listing,
      owner: user._id,
    }));

    // ➕ Insert new listings
    await Listing.insertMany(listingsWithOwner);
    console.log("✅ Listings seeded with owner:", user.username);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error while seeding DB:", err);
  }
};

// ✅ Step 3: Run it
main()
  .then(() => initDB())
  .catch((err) => console.error("❌ DB connection failed:", err));

  





