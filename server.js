// server.js
const express = require('express');
const axios = require('axios');
const config = require('./config');

const app = express();
const port = 5500; 

app.use(express.json());

app.post('/create-meeting', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const meetingData = await createMeeting(accessToken);
        const createUrl = meetingData.start_url;
        const joinUrl = meetingData.join_url
        res.json({ success: true, hostUrl : createUrl, clientUrl: joinUrl });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

async function getAccessToken() {
    try {
        const authResponse = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'account_credentials',
                account_id: config.accountId
            },
            auth: {
                username: config.clientId,
                password: config.clientSecret
            }
        });

        return authResponse.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function createMeeting(accessToken) {
    try {
        const meetingPayload = {
            topic: 'Auto-generated Meeting',
            type: 2,
            start_time: new Date().toISOString(),
            duration: 60,
            timezone: 'America/New_York', // Change to your desired timezone
            password: '12345'
        };

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const meetingResponse = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingPayload, { headers });

        const responseData = meetingResponse.data;

        return responseData;
    } catch (error) {
        console.error('Error creating meeting:', error.response ? error.response.data : error.message);
        throw error;
    }
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
