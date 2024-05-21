//This is a mock database. Your MySQL or MongoDB code will fall
//into here.

const greetings = [
    "Hi!",
    "Hello!",
    "Howdy!",
    "Greetings!"
];
const genericResponses = [
    "I see. Tell me more?",
    "Really? How so?",
    "Is that so?",
    "I didn't know that. Go on."
];

function getResponse(message){
    if(message.includes("Hello") || message.includes("Howdy") ||
            message.includes("Greetings") || message.includes("Hi"))
        return greetings[Math.floor(Math.random()*greetings.length)];
    else
        return genericResponses[Math.floor(Math.random()*genericResponses.length)];
}

module.exports.getResponse = getResponse;

