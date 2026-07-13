import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("server error: ", error);
        process.exit(1);  // exit voi loi
    }
};