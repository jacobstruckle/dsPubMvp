const https = require('https');
const { SUBSCRIPTION_KEY } = require('./utility');

function postRequest(requestOptions, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200, 201, 202) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error(`Failed to add patient: ${responseBody}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

function createNewPatient(accessToken, patientData) {
  const requestOptions = {
    hostname: 'my.staging.dosespot.com',
    port: 443,
    path: '/webapi/v2/api/patients',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Subscription-Key': SUBSCRIPTION_KEY
    }
  };

  return postRequest(requestOptions, patientData);
}

module.exports = { createNewPatient };