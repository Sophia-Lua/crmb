const request = require('node:http').request;

// Test the mock server
const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/api/health',
  method: 'GET'
};

const req = request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();