const { generateJwtAccessToken } = require('../utility');
const { buildPatientData } = require('../requestBuild');
const { createNewPatient } = require('../requestPost');

(async () => {
  try {
    const jwtAccessToken = await generateJwtAccessToken();
    const patientData = buildPatientData();
    const patientResponse = await createNewPatient(jwtAccessToken, patientData);
    console.log('Patient added successfully:', patientResponse);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();