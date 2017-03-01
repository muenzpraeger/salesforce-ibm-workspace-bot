"use strict";

let request = require('request');

let sendMessage = (actor, spaceId, title, message) => {

    if (spaceId==null || spaceId=='') {
        spaceId = process.env.DEV_SPACE_ID;
    }

    console.log('Posting to space ' + spaceId);

    console.log('https://api.watsonwork.ibm.com/v1/spaces/' + spaceId + '/messages');
    request({
        url: 'https://api.watsonwork.ibm.com/v1/spaces/' + spaceId + '/messages',
        method: 'POST',
        "headers": {
            "Authorization": 'Bearer ' + global.accessToken
        },
        json: {
            type: 'appMessage',
            version: '1',
            "annotations":  [ 
    {

      "type": "generic",
      "version": "1",
    
      "color": "#1798c1",
      "title": title,
      "text": message,
    
      "actor": {
        "name": actor
      }

    }
    ]
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
            console.log('Message: ' + response.body.error);
        } else {
            console.log(response.statusCode);
        }
    });
};

exports.sendMessage = sendMessage;