const df = require('dialogflow');

//DialogflowController will have major functionality relating to Dialogflow (such as making and sending requests)
function DialogflowController(agentId, sessionId){
    //Instance vars
    this.agentId = agentId;
    this.sessionId = sessionId;

    //Client set up instance vars
    this.sessionClient = new df.SessionsClient(); //set up client
    this.sessionPath = this.sessionClient.sessionPath(this.agentId, this.sessionId);//set up session path
}

DialogflowController.prototype.languageCode = 'en-US'; //default language code

DialogflowController.prototype.queryAgent = function(queryString, callback){
    //Base case (query is empty, is whitespace or does not exist)
    if(!queryString || !queryString.trim()) return;

    //Creates query string
    function createQuery(query){
        return {
            session: this.sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode: this.languageCode
                }
            }
        };
    };

    //Sends query
    function sendQuery(req, callback){
        this.sessionClient
        .detectIntent(req) //perform a query
        .then(responses => {
            let result = responses[0].queryResult; //Get result

            callback(result); //Run function on result
        })
        .catch(err => {
            console.log('An error has occurred', err);
        });
    }

    //Create and send query, perform callback on response json
    sendQuery.call(this, createQuery.call(this, queryString), callback);
}

//Export
module.exports = DialogflowController;