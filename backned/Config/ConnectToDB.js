import mongoose from 'mongoose';

// Connect to MongoDB with retry/backoff and useful logging.
export const connectToDB = async ({
    maxRetries = 5,
    initialDelay = 2000
} = {}) => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Projectexpo';

    // Mongoose settings
    mongoose.set('strictQuery', false);

    let attempt = 0;
    let delay = initialDelay;

    const connect = async () => {
        attempt += 1;
        try {
            console.log(`[MongoDB] Attempting connection (${attempt}) to: ${mongoUri}`);

            const conn = await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // Customize server selection timeout so failures surface predictably
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                family: 4
            });

            console.log('[MongoDB] Connected');
            console.log('[MongoDB] Database:', conn.connection.name);

            try {
                const collections = await conn.connection.db.listCollections().toArray();
                console.log('[MongoDB] Collections:', collections.map(c => c.name));
            } catch (colErr) {
                console.warn('[MongoDB] Could not list collections:', colErr.message);
            }

            // Attach helpful connection event listeners
            mongoose.connection.on('connected', () => {
                console.log('[MongoDB] connection event: connected');
            });

            mongoose.connection.on('error', (err) => {
                console.error('[MongoDB] connection event: error', err && err.message ? err.message : err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('[MongoDB] connection event: disconnected');
            });

            return conn;
        } catch (err) {
            console.error(`[MongoDB] Connection attempt ${attempt} failed:`, err && err.message ? err.message : err);

            if (attempt >= maxRetries) {
                console.error('[MongoDB] All connection attempts failed. Leaving process running but disabling mongoose buffering.');
                // Prevent mongoose from buffering commands indefinitely
                mongoose.set('bufferCommands', false);
                return null;
            }

            console.log(`[MongoDB] Retrying connection in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            return connect();
        }
    };

    return connect();
};
