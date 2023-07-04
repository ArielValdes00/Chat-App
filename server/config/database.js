import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log(`MongoDB Connected: ${connect.connection.host}`)
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit();
    }
}