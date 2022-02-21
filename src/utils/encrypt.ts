import * as _crypto from 'crypto-js';

const SECRET = process.env.SECRET_ENCRYPT;

const encrypt = (text: string) => {
  const ciphertext = _crypto.AES.encrypt(text, SECRET);
  return ciphertext.toString();
};

const decrypt = (text: string) => {
  const bytes = _crypto.AES.decrypt(text, SECRET);
  return bytes.toString(_crypto.enc.Utf8);
};

const crypto = {
  encrypt,
  decrypt,
};

export default crypto;
