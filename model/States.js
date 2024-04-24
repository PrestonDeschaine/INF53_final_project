const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for MongoDB
const StatesSchema = new Schema({
     statecode: {
        type: String, 
        required: true,
        unique: true
    },
    funfacts: [String] 
});

// Export the model
module.exports = mongoose.model('State', StatesSchema);
