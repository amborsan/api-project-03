import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

export async function withHashedPassword(data) {
  if (typeof data.password !== "string") return data;
  return { ...data, password: await hashPassword(data.password) };
}

export function stripPassword({ password: _password, ...safeUser }) {
  return safeUser;
}

export async function verifyPassword(password, storedPassword, upgradeLegacy) {
  const isHash = BCRYPT_PREFIX.test(storedPassword);
  const valid = isHash ? await bcrypt.compare(password, storedPassword) : password === storedPassword;
  if (valid && !isHash && upgradeLegacy) await upgradeLegacy(await hashPassword(password));
  return valid;
}
