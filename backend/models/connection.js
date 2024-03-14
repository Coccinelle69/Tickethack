const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://mms:4pHXffw8muq6C2hN@cluster0.hbblrzb.mongodb.net/Tickethack";

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
