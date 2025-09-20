import mongoose from 'mongoose';


export const connectToDB = async () => {
    try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
        const dbName = process.env.MONGODB_DBNAME || process.env.MONGO_DB || undefined;

        if (!mongoUri) {
            console.error('Missing MongoDB connection string. Set MONGODB_URI, MONGO_URI or DATABASE_URL in your environment.');
            process.exit(1);
        }

        const connectOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        };

        // Add shorter timeouts so startup fails quickly if DB is unreachable
        const conn = await mongoose.connect(mongoUri, {
            ...connectOptions,
            serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || '5000', 10),
            socketTimeoutMS: parseInt(process.env.MONGO_SOCKET_TIMEOUT_MS || '45000', 10)
        });

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
