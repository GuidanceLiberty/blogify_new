import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        const connect = await mongoose.connect(process.env.DB_URI);
        console.log('connected to  database')
    } catch (error) {
       console.log(`error occured while connecting to database ${error}`);
       process.exit(1);
    }
}

export default connectDB