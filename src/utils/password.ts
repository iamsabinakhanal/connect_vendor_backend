import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  const [scheme, iterationsText, salt, expectedHash] = storedHash.split("$");

  if (scheme !== "pbkdf2" || !iterationsText || !salt || !expectedHash) {
    return false;
  }

  const iterations = Number(iterationsText);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualHash = pbkdf2Sync(password, salt, iterations, expectedBuffer.length, DIGEST);

  if (actualHash.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedBuffer);
};