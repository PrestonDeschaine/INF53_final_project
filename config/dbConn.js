const mongoose = require('mongoose');

// Set up database connection for MongoDB
const connectDB = async () => {
    try {
        // Connect to the MongoDB database using the provided URI
        await mongoose.connect(process.env.DATABASE_URI, { 
            useUnifiedTopology: true,
            useNewUrlParser: true // Corrected typo in useNewUrlParser option
        });
    } catch (err) {
        console.error(err);
    }
}

// Export the connectDB function
module.exports = connectDB;
