"use strict";

// Set the configuration settings
const credentials = {
  client: {
    id: process.env.WW_APP_ID,
    secret: process.env.WW_APP_SECRET
  },
  auth: {
    tokenHost: 'https://api.watsonwork.ibm.com/oauth/token'
  }
};

// Initialize the OAuth2 Library
let oauth2 = require('simple-oauth2').create(credentials);

const tokenConfig = {};

// Callbacks
// Get the access token object for the client
oauth2.clientCredentials.getToken(tokenConfig, (error, result) => {
  if (error) {
    return console.log('Access Token Error', error.message);
  }

  const token = oauth2.accessToken.create(result);
});

// Promises
// Get the access token object for the client
oauth2.clientCredentials
  .getToken(tokenConfig)
  .then((result) => {
    let tempToken = oauth2.accessToken.create(result);
    global.accessToken = tempToken.token.access_token;
    console.log('Token created');
  })
  .catch((error) => {
    console.log('Access Token error', error.message);
  });

