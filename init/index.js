const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    const initDB = async () => {
      // Check or create Muskan admin user
let adminUser = await User.findOne({ username: "muskan" });
if (!adminUser) {
  adminUser = await User.register(
    new User({ username: "muskan", email: "muskan@example.com" }),
    "admin1234"  // ✅ Save this password securely
  );
  console.log("👩‍💻 Admin user 'muskan' created");
} else {
  console.log("👩‍💻 Admin user 'muskan' already exists");
}

      // Check or create demo user
      let demoUser = await User.findOne({ username: "demoUser" });
      if (!demoUser) {
        demoUser = await User.register(
          new User({ username: "demoUser", email: "demo@example.com" }),
          "1234"
        );
        console.log("👤 Demo user created");
      } else {
        console.log("👤 Demo user already exists");
      }

      // OPTIONAL: Add sample listings under demo user
      const dataWithOwner = initData.data.map(obj => ({
        ...obj,
        owner: adminUser._id,
      }));

      await Listing.deleteMany({});
      console.log("🗑️ Old listings deleted");

      await Listing.insertMany(dataWithOwner);
      console.log("✅ Sample listings inserted with demo user as owner");
    };

    await initDB();
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });








