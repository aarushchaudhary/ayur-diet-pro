// Utility functions for date calculations

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format or any valid date format
 * @returns {number} - Age in years
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) {
    return null;
  }
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  // Check if the date is valid
  if (isNaN(birthDate.getTime())) {
    return null;
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // If the birth month hasn't occurred yet this year, or it's the birth month but the day hasn't occurred yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format date for display
 * @param {string} date - Date in any valid format
 * @param {string} format - Format type ('short', 'long', 'medium')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Convert date to input-friendly format (YYYY-MM-DD)
 * @param {string} date - Date in any valid format
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const toInputDateFormat = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toISOString().split('T')[0];
};