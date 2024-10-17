const https = require('https');
const querystring = require('querystring');

const CLINIC_ID = '974998';
const CLINIC_KEY = '6VVTU7HVCT7FKCLC4M4QVV3MHUX6WHMM';
const USER_ID = '3039487';
const SUBSCRIPTION_KEY = '2fff2924a536e371fba9a5381ad0eee094c2f62e22d9ef86c2827014ccd6dda5';

function generateJwtAccessToken() {
  const tokenRequestData = querystring.stringify({
    grant_type: 'password',
    client_id: CLINIC_ID,
    client_secret: CLINIC_KEY,
    username: USER_ID,
    password: CLINIC_KEY,
    scope: 'api',
  });

  const requestOptions = {
    hostname: 'my.staging.dosespot.com',
    port: 443,
    path: '/webapi/v2/connect/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(tokenRequestData),
      'Subscription-Key': SUBSCRIPTION_KEY
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const accessToken = JSON.parse(responseBody).access_token;
          resolve(accessToken);
        } else {
          reject(new Error(`Failed to get access token: ${responseBody}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(tokenRequestData);
    req.end();
  });
}

module.exports = { generateJwtAccessToken,
    SUBSCRIPTION_KEY
 };