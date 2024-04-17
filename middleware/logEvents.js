const {format} = require('date-fns');
const {v4: uuid} = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Function to log events
const logEvents = async (message, logName) => { 
   // Get current date and time
   const dateTime =  `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
   // Generate a UUID for the log item
   const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
   console.log(logItem); // Log the event to console
  
   try {
    // Check if the 'logs' directory exists, if not create it
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname,'..', 'logs'));
    }
    // Append the log item to the log file
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
   } catch (err) {
    console.log(err); // Log any errors that occur
   }
}

// Middleware function to log request details
const logger = ((req,res,next)=> {
    // Log the request method, origin, and URL
    logEvents(`${req.method}\t$${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`); // Log to console
    next(); // Call the next middleware function
});
   
module.exports = {logger, logEvents}; // Export the logger and logEvents functions
