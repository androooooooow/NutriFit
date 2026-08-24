import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        return true;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        console.log("MongoDB is unavailable. Register/login are disabled until Atlas is reachable.");
        return false;
    }
};
