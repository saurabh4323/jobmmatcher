import mongoose from "mongoose";
const MONGODB_URI =
  "mongodb+srv://saurabhiitr:saurabh8810@cluster0.jg0vdfg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
