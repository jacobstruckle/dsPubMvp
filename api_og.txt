
const https = require('https');
const querystring = require('querystring');

const DOSESPOT_BASE_URL = 'https://my.staging.dosespot.com/webapi/v2';
const CLINIC_ID = '974998';
const CLINIC_KEY = '6VVTU7HVCT7FKCLC4M4QVV3MHUX6WHMM';
const USER_ID = '3039487';
const SUBSCRIPTION_KEY = '2fff2924a536e371fba9a5381ad0eee094c2f62e22d9ef86c2827014ccd6dda5';

async function generateJwtAccessToken() {
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

async function createNewPatient(accessToken) {
  const newPatientData = JSON.stringify({
    FirstName: 'John',
    LastName: 'Doe',
    DateOfBirth: '1980-01-01',
    Gender: 'Male',
    Address1: '123 Main St',
    City: 'Anytown',
    State: 'CA',
    ZipCode: '84043',
    PhoneNumber: '801-456-7890',
    PrimaryPhone: '801-456-7890',
    PrimaryPhoneType: 1,
    Active: true
  });

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

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error(`Failed to add patient: ${responseBody}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(newPatientData);
    req.end();
  });
}

(async () => {
  try {
    const jwtAccessToken = await generateJwtAccessToken();
    const patientResponse = await createNewPatient(jwtAccessToken);
    console.log('Patient added successfully:', patientResponse);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
