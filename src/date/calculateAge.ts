
/**
 * 
 */
function calculateAge(birthDateString: string): number {

  const birthDate = new Date(birthDateString);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // Check whether the birthday has already passed in the given year
  const hasHadBirthdayThisYear = 
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  
  if (!hasHadBirthdayThisYear) {
      age--;
  }
  
  return age;
}

export default calculateAge;