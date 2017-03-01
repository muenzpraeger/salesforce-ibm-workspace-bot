"use strict";

let formatAccounts = accounts => {
    let elements = '';
    accounts.forEach(account => {
        elements += '*' + account.get("Name") + '*\n';
        elements += account.get("BillingStreet") + '\n';
        elements += account.get('Phone') + '\n';
        elements += '[Open account](https://login.salesforce.com/' + account.get("id") + ')' + '\n\n';
        }
    );
    return elements;
};


let formatTopOpportunities = opportunities => {
    let elements = '';
    opportunities.forEach(opportunity => {
        elements += '*' + opportunity.get("Name") + '*\n';
        elements += 'Account: ' + opportunity.get("Account").Name + '\n';
        elements += 'Amount: ' + opportunity.get('Amount') + '\n';
        }
    );
    return elements;
};

exports.formatAccounts = formatAccounts;
exports.formatTopOpportunities = formatTopOpportunities;