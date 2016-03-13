/**
 * This is modified code from sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.c1e3fa6c-87c5-4009-b31d-548c06ffb027") {
             context.fail("Invalid Application ID");
        }
        */


        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // console.log("onIntent intentName=" + intentName);
    // console.log("onIntent session.attributes.itemBeingSearched = "+ session.attributes.itemBeingSearched);

    // Dispatch to your skill's intent handlers
    if ("WhereIsItIntent" === intentName || "DoYouHaveIntent" === intentName) {
        searchForItem(intent, session, callback);
    } else if ("AnswerIntent" === intentName) {
        setColorInSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    //var speechOutput = "Welcome to the Alexa Skills Kit sample. " +
      //  "Please tell me your favorite color by saying, my favorite color is red";
    var speechOutput = "Welcome! How can I help you find?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me what you are looking for by saying, Where can I find apples?";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the item in the session and prepares the speech to reply to the user.
 */
function searchForItem(intent, session, callback) {
    var intentName = intent.name;
    var itemSearchedFor = intent.slots.Item;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (itemSearchedFor) {
        sessionAttributes = {itemSearchedFor: itemSearchedFor.value};

        // e.g. "Dairy items like " + itemSearchedFor + " can be found in <insert location>";

        /* Call function to locate in the DB */
        //var dbItem = getLocationOfItem(itemSearchedFor.value);


        var ddb = require('dynamodb').ddb({ accessKeyId: 'AKIAIUSI2TR6CN3GFKIA', secretAccessKey: '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' });

        ddb.query('inventory', itemSearchedFor.value, {}, function(err, res, cap) {
          if (err){
            console.log(err);
            speechOutput = "I cannot find " + itemSearchedFor.value + " in the store. Please try again.";
          } else if (res){
            var dbItem = res.items[0];
            if (dbItem && dbItem.Location) {
                speechOutput = itemSearchedFor.value + " can be found in " + dbItem.Location + ". Goodbye.";
                shouldEndSession = true;
            }
          }

          callback(sessionAttributes,
            buildSpeechletResponse(intentName, speechOutput, repromptText, shouldEndSession));

        });

    } else {
        speechOutput = "Sorry, I didn't catch what you are looking for. Please try again.";
        repromptText = "Can I help you find something in the store?";
        // TODO: Make suggestions to consumer? Read out available categories of items? (e.g. Meat, Dairy, Drinks, Frozen, ...)

        callback(sessionAttributes,
            buildSpeechletResponse(intentName, speechOutput, repromptText, shouldEndSession));
    } 
}

/**
 * Failed to recognize the item (confirmation answer is NO)
 */
function failedToSetItemInSession(intent, session, callback) {
    speechOutput = "I am sorry but I cannot understand you. Please try again. Good bye.";
    repromptText = null;
    shouldEndSession = true;

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
