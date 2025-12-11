const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    // Simple regex to find the key
    const match = envContent.match(/ELEVENLABS_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
        if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
            apiKey = apiKey.slice(1, -1);
        }
    }
} catch (e) { }

console.log(`Checking key: ${apiKey ? apiKey.substring(0, 5) + '...' : 'None'}`);

const options = {
    hostname: 'api.elevenlabs.io',
    path: '/v1/user',
    method: 'GET',
    headers: { 'xi-api-key': apiKey }
};

const req = https.request(options, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        console.log("Body:", data);
        if (res.statusCode === 200) {
            console.log("SUCCESS: Key is valid.");
        } else {
            console.log("FAILURE: Key is invalid or has issue.");
        }
    });
});
req.end();
