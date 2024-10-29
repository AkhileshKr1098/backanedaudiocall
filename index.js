// server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const twilio = require('twilio');
const cors = require('cors'); 
const app = express();

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

app.use(express.json());
app.use(cors());

app.post('/call', (req, res) => {
    const { targetNumber } = req.body;
    console.log(`Target number received: ${targetNumber}`);
    
    if (!targetNumber) {
        return res.status(400).json({ message: 'Target number is required.' });
    }

    client.calls
        .create({
            from: twilioNumber, // Use the Twilio number from .env
            to: targetNumber,
            url: 'http://demo.twilio.com/docs/voice.xml' // Testing URL
        })
        .then(call => {
            console.log(`Call initiated successfully. Call SID: ${call.sid}`);
            res.json({ message: 'Call initiated successfully', callSid: call.sid });
        })
        .catch(error => {
            console.error(`Error initiating call: ${error.message}`);
            res.status(500).json({ message: 'Error initiating call', error: error.message });
        });
});

// Optional TwiML response endpoint
app.post('/twiml-response', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say("Connecting your call, please wait.");
    res.type('text/xml');
    res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
