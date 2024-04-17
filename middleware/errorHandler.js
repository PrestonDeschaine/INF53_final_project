const {logEvents} = require('./logEvents');

// Error handler middleware function
const errorHandler = (err,req,res,next) =>{
    // Log the error message to a file
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack); // Log the error stack to console
    res.status(500).send(err.message); // Send a 500 status response with the error message
};

module.exports = {errorHandler}; // Export the errorHandler function
