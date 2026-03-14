import CryptoJs from 'crypto-js';

export const Encrypt = (plaintext: string, secretKey: string) => {
  return CryptoJs.AES.encrypt(JSON.stringify(plaintext), secretKey).toString();
};

export const Decrypt = (ciphertext: string, secretKey: string) => {
  const bytes = CryptoJs.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
};
