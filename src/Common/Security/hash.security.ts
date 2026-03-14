import * as bcrypt from 'bcrypt';

export const Hash = (
  plainText: string,
  saltRound: number = +(process.env.SALT_ROUNDS as string),
): string => {
  return bcrypt.hashSync(plainText, saltRound);
};

export const CompareHash = (plainText: string, hashedText: string): boolean => {
  return  bcrypt.compareSync(plainText, hashedText);
};
