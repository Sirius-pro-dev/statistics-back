import mongoose from 'mongoose';

export const connect = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.SIRIUS_X_MONGO_USERNAME}:${process.env.SIRIUS_X_MONGO_PASSWORD}@statisticsdb.ypcrfla.mongodb.net/?retryWrites=true&w=majority`);

    console.log('Connected to db');

    return async function() {
        await mongoose.disconnect();
    }
}
