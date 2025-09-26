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
    return ciphertext;
  }
};

const processPatientData = (patientObject, operation) => {
    const func = operation === 'encrypt' ? encrypt : decrypt;
    const processed = { ...patientObject };
    const fieldsToProcess = [
        'abhaId', 'gender', 'dob', 'dietaryHabits', 'mealFrequency', 'foodPreferences',
        'waterIntake', 'bowelMovements', 'medicalConditions', 'medications',
        'supplements', 'allergies', 'bloodType', 'height', 'weight', 'BMI',
        'waistCircumference', 'activityLevel', 'sleepPattern', 'stressLevel',
        'smokingStatus', 'alcoholIntake', 'notes', 'lastVisit'
    ];
    
    for (const key of fieldsToProcess) {
        if (processed[key] !== null && processed[key] !== undefined && processed[key] !== '') {
            if (Array.isArray(processed[key])) {
                processed[key] = processed[key].map(item => {
                    if (item !== null && item !== undefined && item !== '') {
                        return func(item);
                    }
                    return item;
                }).filter(item => item !== null && item !== undefined && item !== '');
            } else {
                processed[key] = func(processed[key]);
            }
        }
    }
    return processed;
};

// @desc    Get all patients for a user (and decrypt them)
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ user: req.user.id });
  const decryptedPatients = patients.map(p => {
    const patientObj = p.toObject();
    const plainPatient = processPatientData(patientObj, 'decrypt');
    plainPatient._id = p._id;
    plainPatient.name = p.name;
    return plainPatient;
  });
  res.status(200).json(decryptedPatients);
});

// --- THIS IS THE NEW FUNCTION TO ADD ---
// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
const getPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient || patient.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Patient not found or user not authorized');
    }

    const patientObj = patient.toObject();
    const plainPatient = processPatientData(patientObj, 'decrypt');
    plainPatient._id = patient._id; 
    
    res.status(200).json(plainPatient);
});
// --- END OF NEW FUNCTION ---

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
  getPatient, // <-- Make sure to export the new function
  addPatient,
  updatePatient,
  deletePatient,
};