import mongoose from 'mongoose';


export const connectToDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Projectexpo';
        const dbName = process.env.MONGODB_DBNAME || process.env.MONGO_DB || undefined;

        if (!mongoUri) {
            console.error('Missing MongoDB connection string. Set MONGODB_URI in your environment.');
            process.exit(1);
        }

        const connectOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        };

        const conn = await mongoose.connect(mongoUri, connectOptions);

        // If a DB name was provided separately, switch to it for logging
        const activeDbName = dbName || conn.connection.name;

    console.log('MongoDB Connected');
    console.log('Database:', activeDbName);
        
        // List all collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
