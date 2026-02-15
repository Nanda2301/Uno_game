const jwt = require("jsonwebtoken");

/**
 * Essa função é útil quando precisarmos fornecer tokens para nossos testes
 * 
 * @returns token JWT for test
 */
module.exports =  function generateTestToken(testId=1, testEmail="test@gmail.com") {
  return jwt.sign(
    { id: testId, email: testEmail },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );
}
