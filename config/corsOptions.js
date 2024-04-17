// Set up CORS options with whitelist
const whitelist = [
  'http://127.0.0.1:5500', 
  'http://localhost:3500'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is in the whitelist or if it's absent
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // If origin is not in the whitelist, deny access
      callback(new Error('Not Allowed By CORS'));
    }
  },
  // Set the success status code to 200
  optionSuccessStatus: 200
};

// Export CORS options
module.exports = corsOptions;
