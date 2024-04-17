const State = require('../model/States');

// Function to retrieve all fun facts
// Retrieves all States from JSON
const data = {
    states: require('../model/state.json'),
    setStates: function (data) {this.states = data}
};

// Combines the states from the JSON with MongoDB
async function setFacts(){
    for (const state in data.states){ 
        const fact = await State.findOne({statecode: data.states[state].code}).exec(); // Compares each state
        if (fact){   
            data.states[state].funfacts = fact.funfacts; // Adds the fun facts to the JSON
        }
    }
}

// Runs setFacts to merge the JSON with MongoDB
setFacts();

// Get all states
const getAllStates = async (req,res)=> {
    // Check for query parameters
    if (req.query){
        if(req.query.contig == 'true')   // If contig is true, remove AK and HI
        {
            const result = data.states.filter(st => st.code != "AK" && st.code != "HI");
            res.json(result);
            return;
        }
        else if (req.query.contig == 'false') // If contig is false, display only AK and HI
        {
            const result = data.states.filter( st => st.code == "AK" || st.code == "HI");     
            res.json(result);
            return;
        }
    }

    // Otherwise, return all states
    res.json(data.states);
}

// Get one state
const getState = (req,res)=> {
    // Get the state code and set it to uppercase
    const code = req.params.state.toUpperCase();
    // Search for the state parameter
    const state = data.states.find( st => st.code == code);
    if(!state){ // If it doesn't exist, send a message
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json(state);
 }

 // Get state and capital
 const getCapital = (req,res)=> {
     // Get the state code and set it to uppercase
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code);
    if(!state){ // Check state parameter
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "capital": state.capital_city}); // If state, send capital
 }

 // Get state and nickname
 const getNickname = (req,res)=> {
     // Get the state code and set it to uppercase
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code); // Check for state parameter
    if(!state){ 
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "nickname": state.nickname}); // If state, send nickname
 }

 // Get state and population
 const getPopulation = (req,res)=> {
     // Get the state code and set it to uppercase
    const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code); // Check state parameter
    if(!state){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "population": state.population.toLocaleString("en-US")}); // If state, send population
 }
 
 // Get state and date of admittance
 const getAdmission = (req,res)=> {

     // Get the state code and set it to uppercase
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code); // Check state parameter
    if(!state){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "admitted": state.admission_date}); // If state, send date of admittance
 }

 // Get a random fun fact
 const getFunFact = (req,res)=>{
     // Get the state code and set it to uppercase
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code);
    if(!state){ // If it doesn't exist, send a message
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(state.funfacts){ // If the state has fun facts
         res.status(201).json({"funfact": state.funfacts[Math.floor((Math.random()*state.funfacts.length))]}); // Grab a random one
    } 
    else
    {
        res.status(201).json({"message": `No Fun Facts found for ${state.state}`}); // If not, send a message
    }
}

// Create fun facts
const createFunFact = async (req,res)=>{
    if (!req?.params?.state){ // Check for state
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(!req?.body?.funfacts){
        return res.status(400).json({"message": "State fun facts value required"});
    }
    if(!Array.isArray(req.body.funfacts)) { // Check for array
        return res.status(400).json({'message': "State fun facts value must be an array"});
    }

     // Get the state code and set it to uppercase
     const code = req.params.state.toUpperCase();

    try {
        // If the fun fact cannot be added to an existing group, create a new one 
       if(!await State.findOneAndUpdate({statecode: code},{$push: {"funfacts": req.body.funfacts}})){   
            await State.create({ 
                statecode: code,
                funfacts: req.body.funfacts
             });
        } // Grab the result of the operation
        const result = await State.findOne({statecode: code}).exec();
     
        res.status(201).json(result); // Send it out
    } catch (err) {console.error(err);}   
    
    setFacts(); // Rebuild the JSON
}

// Update fun fact
const updateFunFact = async (req,res)=>{
    if(!req?.params?.state){ // Check for state
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(!req?.body?.index) // Check for index
    {
        return res.status(400).json({"message": "State fun fact index value required"});
    }
    if(!req?.body?.funfact){// Check for fun fact
        return res.status(400).json({"message": "State fun fact value required"});
    }
   
     // Get the state code and set it to uppercase
     const code = req.params.state.toUpperCase();

    const state = await State.findOne({statecode: code}).exec(); // Find the state
    const jstate = data.states.find( st => st.code == code);

    let index = req.body.index; // Record the index

    if (!jstate.funfacts || index-1 == 0)
    {
        return res.status(400).json({"message": `No Fun Facts found for ${jstate.state}`});
    }
    
    if(index > state.funfacts.length || index < 1 || !index){ // See if that index exists
        const state = data.states.find( st => st.code == code);
        return res.status(400).json({"message": `No Fun Fact found at that index for ${jstate.state}`});
    }
    index -= 1; // Reduce the index to meet the correct spot

    if (req.body.funfact) state.funfacts[index] = req.body.funfact; // If a fun fact exists, copy the new one over
    
    const result = await state.save(); // Save the result

    res.status(201).json(result);

    setFacts(); // Rebuild the JSON
}   

// Delete fun fact
const deleteFunFact = async(req,res)=>{
    
    if(!req.params.state){ // Check for state
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(!req.body.index) // Check for index
    {
        return res.status(400).json({"message": "State fun fact index value required"});
    }

     // Get the state code and set it to uppercase
    const code = req.params.state.toUpperCase();

    const state = await State.findOne({statecode: code}).exec(); // Find the state
    const jstate = data.states.find( st => st.code == code);

    let index = req.body.index; // Record the index

    if (!jstate.funfacts || index-1 == 0)
    {
        return res.status(400).json({"message": `No Fun Facts found for ${jstate.state}`});
    }
    
    if(index > state.funfacts.length || index < 1 || !index){ // See if that index exists
        const state = data.states.find( st => st.code == code);
        return res.status(400).json({"message": `No Fun Fact found at that index for ${jstate.state}`});
    }
    index -= 1; // Reduce the index to meet the correct spot

    state.funfacts.splice(index, 1); // If it does, slice off the fact
    
    const result = await state.save(); // Save the result

    res.status(201).json(result);

    setFacts(); // Rebuild the JSON
}

module.exports={
    getAllStates, 
    getState, 
    getNickname, 
    getPopulation, 
    getCapital, 
    getAdmission, 
    getFunFact, 
    createFunFact, 
    updateFunFact,
    deleteFunFact
};
