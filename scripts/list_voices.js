const fs = require('fs');
const path = require('path');
const https = require('https');

// Simple .env parser since we don't want to rely on dotenv package being installed in root
const envPath = path.join(__dirname, '..', '.env');
let apiKey = '';

try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            if (line.startsWith('ELEVENLABS_API_KEY=')) {
                apiKey = line.split('=')[1].trim();
                // Handle quotes if present
                if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
                    apiKey = apiKey.slice(1, -1);
                }
                break;
            }
        }
    }
} catch (e) {
    console.error("Error reading .env:", e);
}

if (!apiKey) {
    console.error("Error: ELEVENLABS_API_KEY not found in .env");
    process.exit(1);
}

const options = {
    hostname: 'api.elevenlabs.io',
    path: '/v1/voices',
    method: 'GET',
    headers: {
        'xi-api-key': apiKey
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                console.log("\n--- Available Voices ---");
                json.voices.forEach(voice => {
                    console.log(`Name: ${voice.name.padEnd(20)} | ID: ${voice.voice_id} | Category: ${voice.category}`);
                });
                console.log("------------------------\n");
            } catch (e) {
                console.error("Failed to parse response:", e);
            }
        } else {
            console.error(`Status Code: ${res.statusCode}`);
            console.error("Response:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
