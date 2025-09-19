import mongoose from 'mongoose';


export const connectToDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/Projectexpo', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });

        console.log('MongoDB Connected');
        console.log('Database:', conn.connection.name);
        
        // List all collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
