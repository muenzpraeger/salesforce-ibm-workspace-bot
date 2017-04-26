"use strict";

let request = require('request'),
    salesforce = require('./salesforce'),
    wwMessaging = require('./wwMessaging'),
    wwFormatting = require('./wwFormatting'),
    crypto = require("crypto");

exports.PostWorkspace = (slots, session, response) => {
        salesforce.getTopOpportunities(3).then(opportunities => {
            wwMessaging.sendMessage('', '59006be8e4b0180503ee7225', '', wwFormatting.formatTopOpportunities(opportunities));
        }); // TODO: We're using a fixed spaceId here - but you can built your own query for available spaces ;-)
    response.say("Ok, I posted the top opportunities");
};

