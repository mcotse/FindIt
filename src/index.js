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

        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.c1e3fa6c-87c5-4009-b31d-548c06ffb027") {
             context.fail("Invalid Application ID");
        }


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
    if ("WhereIsItIntent" === intentName) {
        setItemInSession(intent, session, callback);
    /*
    } else if ("AnswerIntent" === intentName) {
        setColorInSession(intent, session, callback);
    } else if ("WhatsMyColorIntent" === intentName) {
        getColorFromSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.YesIntent" === intentName && session.attributes && session.attributes.itemBeingSearched) {
        console.log('TEST YES');
        getLocationOfItem(callback);
    } else if ("AMAZON.NoIntent" === intentName && session.attributes && session.attributes.itemBeingSearched) {
        console.log('TEST NO');
        failedToSetItemInSession(callback);
    } else if ("TestIntent" === intentName) {
        console.log("yu fukin kno it");
    */
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
    var speechOutput = "Welcome to the Alexa Where Is It sample. How can I help you?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me what you are looking for by saying, " +
        "Where can I find apples";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setItemInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var itemSearchedFor = intent.slots.Item;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (itemSearchedFor) {
        sessionAttributes = {itemSearchedFor: itemSearchedFor.value};
        speechOutput = "Are you looking for " + itemSearchedFor.value + "?";
        repromptText = "You can ask me where something is by saying, where is the salt?";
    } else {
        speechOutput = "I'm not sure what you are looking for. Please try again";
        repromptText = "I'm not sure what you are looking for. You can ask me where is the salt?";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getLocationOfItem(intent, session, callback) {
    // TODO:
    var itemBeingSearched;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (session.attributes) {
        itemBeingSearched = session.attributes.itemBeingSearched;
    }

    if (itemBeingSearched) {
        speechOutput = "Item " + itemBeingSearched + " is located in \'Aisle 3\'. Goodbye.";
        shouldEndSession = true;
    } else {
        speechOutput = "I cannot find item " + itemBeingSearched + " in the store. Please try again.";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
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



/****** FROM COLOR PICKER SAMPLE... ****/
// function createFavoriteColorAttributes(favoriteColor) {
//     return {
//         favoriteColor: favoriteColor
//     };
// }

// function getColorFromSession(intent, session, callback) {
//     var favoriteColor;
//     var repromptText = null;
//     var sessionAttributes = {};
//     var shouldEndSession = false;
//     var speechOutput = "";

//     if (session.attributes) {
//         favoriteColor = session.attributes.favoriteColor;
//     }

//     if (favoriteColor) {
//         speechOutput = "Your favorite color is " + favoriteColor + ". Goodbye.";
//         shouldEndSession = true;
//     } else {
//         speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color " +
//             " is red";
//     }

//     // Setting repromptText to null signifies that we do not want to reprompt the user.
//     // If the user does not respond or says something that is not understood, the session
//     // will end.
//     callback(sessionAttributes,
//          buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
// }

// /**
//  * Sets the color in the session and prepares the speech to reply to the user.
//  */
// function setColorInSession(intent, session, callback) {
//     var cardTitle = intent.name;
//     var favoriteColorSlot = intent.slots.Answer;
//     var repromptText = "";
//     var sessionAttributes = {};
//     var shouldEndSession = false;
//     var speechOutput = "";

//     if (favoriteColorSlot) {
//         var favoriteColor = favoriteColorSlot.value;
//         sessionAttributes = createFavoriteColorAttributes(favoriteColor);
//         speechOutput = "I now know your favorite color is " + favoriteColor + ". You can ask me " +
//             "your favorite color by saying, what's my favorite color?";
//         repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
//     } else {
//         speechOutput = "I'm not sure what your favorite color is. Please try again";
//         repromptText = "I'm not sure what your favorite color is. You can tell me your " +
//             "favorite color by saying, my favorite color is red";
//     }

//     callback(sessionAttributes,
//          buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
// }

// function createFavoriteColorAttributes(favoriteColor) {
//     return {
//         favoriteColor: favoriteColor
//     };
// }

// function getColorFromSession(intent, session, callback) {
//     var favoriteColor;
//     var repromptText = null;
//     var sessionAttributes = {};
//     var shouldEndSession = false;
//     var speechOutput = "";

//     if (session.attributes) {
//         favoriteColor = session.attributes.favoriteColor;
//     }

//     if (favoriteColor) {
//         speechOutput = "Your favorite color is " + favoriteColor + ". Goodbye.";
//         shouldEndSession = true;
//     } else {
//         speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color " +
//             " is red";
//     }

//     // Setting repromptText to null signifies that we do not want to reprompt the user.
//     // If the user does not respond or says something that is not understood, the session
//     // will end.
//     callback(sessionAttributes,
//          buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
// }

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
