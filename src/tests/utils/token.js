import jwt from "jsonwebtoken";

/**
 * Essa função é útil quando precisarmos fornecer tokens para nossos testes
 * 
 * @returns token JWT for test
 */
export function generateTestToken() {
  return jwt.sign(
    { id: 1, email: "test@gmail.com" },
    process.env.JWT_SECRET || "test_secret",
    { expiresIn: "1h" }
  );
}
