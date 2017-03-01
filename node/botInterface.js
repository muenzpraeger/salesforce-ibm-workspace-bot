"use strict";

let request = require('request'),
    salesforce = require('./salesforce'),
    wwOauth = require('./wwOAuth'),
    wwMessaging = require('./wwMessaging'),
    wwFormatting = require('./wwFormatting'),
    crypto = require("crypto");

let processGet = (req, res) => {
    console.log(req.body);
}

let processPost = (req, res) => {
    if (req.body.type != null) {
        if (req.body.type == 'verification') {
            verifyCallback(req, res);
        } else {
            if (req.body.userName == 'Salesforce Bot') { // TODO: Change this to the name of your app, so that you won't respond to your own messages!
                res.sendStatus(200);
                return;
            }
            if (req.body.type == 'message-created') {
                processText(req.body.content, req.body.spaceId);
            }
        res.sendStatus(200);
        }
    }
}

let processText = (message, spaceId)  => {
    let match;
    match = message.match(/help/i);
    if (match) {
        wwMessaging.sendMessage('Salesforce Bot', spaceId, 'Help',
            `You can ask me things like:
    Search account Acme
        `);
        return;
    }

    match = message.match(/search account (.*)/i);
    if (match) {
        salesforce.findAccount(match[1]).then(accounts => {
            wwMessaging.sendMessage('', spaceId, '', wwFormatting.formatAccounts(accounts));
        });
        return;
    }

};

// Process webhook verification requests
let verifyCallback = (req, res) => {
    console.log("Verifying challenge");

    const bodyToSend = {
        response: req.body.challenge
    };

    // Create a HMAC-SHA256 hash of the recieved body, using the webhook secret
    // as the key, to confirm webhook endpoint.
    let hashToSend =
        crypto.createHmac('sha256', process.env.WW_WEBHOOK_SECRET)
            .update(JSON.stringify(bodyToSend))
            .digest('hex');

    res.set('X-OUTBOUND-TOKEN', hashToSend);
    res.send(bodyToSend).end();
};


exports.processGet = processGet;
exports.processPost = processPost;