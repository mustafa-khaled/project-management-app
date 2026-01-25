const bcrypt = require("bcryptjs");

export const hashValues = async (value: string, saltRounds: number = 10) => {
  return await bcrypt.hash(value, saltRounds);
};

export const compareValues = async (value: string, hash: string) => {
  return await bcrypt.compare(value, hash);
};
