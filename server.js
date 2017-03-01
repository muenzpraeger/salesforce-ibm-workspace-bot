var express = require('express');
var bodyParser = require('body-parser');
var botInterface = require('./node/botInterface');
var http = require('http');
var https = require('https');
var env = require('node-env-file');
var alexa = require('./node/alexa');
var handlers = require('./node/alexaHandlers');

// Load environment variables for localhost
try {
	env(__dirname + '/.env');
} catch (e) {}

var app = express();

var port = process.env.PORT || 5000;
var https_port = process.env.HTTPS_PORT || parseInt(port) + 1;

app.use(bodyParser.json({limit: '50mb'}));

app.get('/botInterface', botInterface.processGet);
app.post('/botInterface', botInterface.processPost);

app.post('/alexa', (req, res) => {

    let alx = alexa(req, res),
        type = alx.type,
        intent = alx.intent,
        slots = alx.slots,
        session = alx.session,
        response = alx.response;

    if (type === 'LaunchRequest') {
        response.say("Welcome to Salesforce and Workspace");
    } else if (type === 'IntentRequest') {
        let handler = handlers[intent];
        if (handler) {
            handler(slots, session, response);
        } else {
            response.say("I don't know how to answer that");
        }
    } else {
        response.say("Not sure what you mean");
    }

});

// Create an HTTP service
http.createServer(app).listen(port);
console.log("Server listening for HTTP connections on port ", port);

// Create an HTTPS service if the certs are present
try {
	var options = {
	  key: fs.readFileSync('key.pem'),
	  cert: fs.readFileSync('key-cert.pem')
	};
	https.createServer(options, app).listen(https_port);
	console.log("Server listening for HTTPS connections on port ", https_port);
} catch (e) {
	console.error("Security certs not found, HTTPS not available");
}