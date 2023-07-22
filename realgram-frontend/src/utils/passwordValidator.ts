// Custom validator function
function validatePassword(password: string) {
  // Check the password length
  if (password.length < 8 || password.length > 20) {
    return false;
  }

  // Check if the password contains letters and numbers using a regular expression
  const lettersAndNumbersRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
  if (!lettersAndNumbersRegex.test(password)) {
    return false;
  }

  return true;
}

export default validatePassword;
