const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

mongoose.connect(process.env.MONGO_URL, {
})
.then(async () => {
  console.log("✅ Connected to MongoDB");

  const initDB = async () => {
    // Find user by username or email (you can change this condition)
    const user = await User.findOne({ username: "muskan" }); // or use { email: "muskan@example.com" }

    if (!user) {
      console.error("❌ User not found! Please create the user before running initDB.");
      return;
    }

    const dataWithOwner = initData.data.map(obj => ({
      ...obj,
      owner: user._id,
    }));

    await Listing.deleteMany({});
    console.log("🗑️ Old listings deleted");

    await Listing.insertMany(dataWithOwner);
    console.log("✅ Sample listings inserted with dynamic owner:", user._id);
  };

  await initDB();
  mongoose.connection.close();
})
.catch((err) => {
  console.log("Mongo URL:", process.env.MONGO_URL);
  console.error("❌ MongoDB connection error:", err);
});







