"use strict";

let nforce = require('nforce'),

    SALESFORCE_CONSUMER_KEY = process.env.SALESFORCE_CONSUMER_KEY,
    SALESFORCE_CONSUMER_SECRET = process.env.SALESFORCE_CONSUMER_SECRET,
    SALESFORCE_USERNAME = process.env.SALESFORCE_USERNAME,
    SALESFORCE_PASSWORD = process.env.SALESFORCE_PASSWORD;

let org = nforce.createConnection({
    clientId: SALESFORCE_CONSUMER_KEY,
    clientSecret: SALESFORCE_CONSUMER_SECRET,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    mode: 'single',
    autoRefresh: true
});

let login = () => {
    org.authenticate({username: SALESFORCE_USERNAME, password: SALESFORCE_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });
};

let findAccount = name => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, BillingStreet, BillingCity, BillingState, Phone FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let accounts = resp.records;
                resolve(accounts);
            }
        });
    });

};

let getTopOpportunities = count => {

    count = count || 5;

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate, Account.Name FROM Opportunity WHERE isClosed=false ORDER BY amount DESC LIMIT " + count;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

login();

exports.org = org;
exports.findAccount = findAccount;
exports.getTopOpportunities = getTopOpportunities;