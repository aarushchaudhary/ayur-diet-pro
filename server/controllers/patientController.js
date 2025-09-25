const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const CryptoJS = require('crypto-js');

// --- Encryption & Decryption Helpers ---
const secretKey = process.env.ENCRYPTION_KEY;

const encrypt = (text) => {
  if (text === null || typeof text === 'undefined' || text === '') return text;
  return CryptoJS.AES.encrypt(JSON.stringify(text), secretKey).toString();
};

const decrypt = (ciphertext) => {
  if (ciphertext === null || typeof ciphertext === 'undefined' || ciphertext === '') return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (e) {
    // If decryption fails, it might be unencrypted data. Return as is.
    return ciphertext;
  }
};

const processPatientData = (patientObject, operation) => {
    const func = operation === 'encrypt' ? encrypt : decrypt;
    const processed = { ...patientObject };
    const fieldsToProcess = [
        'gender', 'dob', 'dietaryHabits', 'mealFrequency', 'foodPreferences',
        'waterIntake', 'bowelMovements', 'medicalConditions', 'medications',
        'supplements', 'allergies', 'bloodType', 'height', 'weight', 'BMI',
        'waistCircumference', 'activityLevel', 'sleepPattern', 'stressLevel',
        'smokingStatus', 'alcoholIntake', 'notes', 'lastVisit'
    ];
    for (const key of fieldsToProcess) {
        if (processed[key]) {
            processed[key] = func(processed[key]);
        }
    }
    return processed;
};

// @desc    Get all patients for a user (and decrypt them)
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ user: req.user.id });

  // CORRECTED DECRYPTION LOGIC
  const decryptedPatients = patients.map(p => {
    const plainPatient = processPatientData(p.toObject(), 'decrypt');
    plainPatient._id = p._id;
    plainPatient.name = p.name; // Name is not encrypted
    return plainPatient;
  });

  res.status(200).json(decryptedPatients);
});

// @desc    Add a new patient (and encrypt their data)
const addPatient = asyncHandler(async (req, res) => {
  const { name, dob, gender } = req.body;
  if (!name || !dob || !gender) {
    res.status(400);
    throw new Error('Please provide name, date of birth, and gender');
  }
  const encryptedData = processPatientData(req.body, 'encrypt');
  const patient = await Patient.create({
    ...encryptedData,
    name,
    user: req.user.id,
  });
  res.status(201).json(patient);
});

// @desc    Update a patient
const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Patient not found or user not authorized');
    }
    const encryptedData = processPatientData(req.body, 'encrypt');
    if (req.body.name) {
        encryptedData.name = req.body.name;
    }
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, encryptedData, { new: true });
    res.status(200).json(updatedPatient);
});

// @desc    Delete a patient
const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient || patient.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Patient not found or user not authorized');
    }
    await patient.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Patient removed' });
});

module.exports = {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
};