const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const Patient = require('./models/Patient');

// Encryption function
const secretKey = process.env.ENCRYPTION_KEY;
const encrypt = (text) => {
  if (text === null || typeof text === 'undefined' || text === '') return text;
  return CryptoJS.AES.encrypt(JSON.stringify(text), secretKey).toString();
};

const updatePatientsWithSampleData = async () => {
  try {
    console.log('Connected to MongoDB...');
    
    const patients = await Patient.find({});
    console.log(`Found ${patients.length} patients`);
    
    for (const patient of patients) {
      // Generate sample data based on patient name
      let abhaId, dietaryHabits, lastVisit;
      
      if (patient.name === 'Karnika') {
        abhaId = '12-3456-7890-1234';
        dietaryHabits = 'Vegetarian';
        lastVisit = '2024-12-15';
      } else if (patient.name === 'Sulakshana') {
        abhaId = '98-7654-3210-9876';
        dietaryHabits = 'Non-Vegetarian';
        lastVisit = '2024-12-10';
      } else if (patient.name === 'Nandini') {
        abhaId = '56-7890-1234-5678';
        dietaryHabits = 'Vegan';
        lastVisit = '2024-12-05';
      } else {
        // Default data for other patients
        abhaId = `${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;
        dietaryHabits = ['Vegetarian', 'Non-Vegetarian', 'Vegan'][Math.floor(Math.random() * 3)];
        lastVisit = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }
      
      // Encrypt the data
      const encryptedAbhaId = encrypt(abhaId);
      const encryptedDietaryHabits = encrypt(dietaryHabits);
      const encryptedLastVisit = encrypt(lastVisit);
      
      // Update the patient
      await Patient.findByIdAndUpdate(patient._id, {
        abhaId: encryptedAbhaId,
        dietaryHabits: encryptedDietaryHabits,
        lastVisit: encryptedLastVisit
      });
      
      console.log(`Updated ${patient.name} with:`);
      console.log(`  ABHA ID: ${abhaId}`);
      console.log(`  Dietary Habits: ${dietaryHabits}`);
      console.log(`  Last Visit: ${lastVisit}`);
    }
    
    console.log('\nAll patients updated successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error updating patients:', error);
    process.exit(1);
  }
};

updatePatientsWithSampleData();