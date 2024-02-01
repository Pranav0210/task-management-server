const express = require('express');
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.get('/call-user', async(req, res) =>{
    const twiml = new VoiceResponse();
    const {title, task_id} = req.body;
    twiml.say(`This is an urgent reminder regarding task titled ${title}, having id ${task_id} which is now overdue. This task is now being archived.`);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
})