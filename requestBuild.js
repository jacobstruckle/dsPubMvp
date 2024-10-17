function buildPatientData() {
    return JSON.stringify({
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
  }
  
  module.exports = { buildPatientData };
  