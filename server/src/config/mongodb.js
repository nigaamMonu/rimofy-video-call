import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => { // event listener for successful connection
      console.log("MongoDB connected successfully");
    });

    await mongoose.connect(process.env.MONGO_URI); // fires the conneceted event on success
  } catch (err) {
    console.log("MongoDB connection failed");
    console.log(err);
  }
};
export default connectDB;
