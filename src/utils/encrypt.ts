import * as crypto from 'crypto-js';

const SECRET = process.env.SECRET_ENCRYPT;

const encrypt = (text: string) => {
  const ciphertext = crypto.AES.encrypt(text, SECRET);
  return ciphertext.toString();
};

const decrypt = (text: string) => {
  const bytes = crypto.AES.decrypt(text, SECRET);
  return bytes.toString(crypto.enc.Utf8);
};

export { encrypt, decrypt };
