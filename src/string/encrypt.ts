//@ts-nocheck

import CryptoJS from 'crypto-js';


/* !- Constants */

export const format =
  {
    stringify: (cipherParams) =>
    {
      const j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
      if (cipherParams.iv) j.iv = cipherParams.iv.toString();
      if (cipherParams.salt) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
    },

    parse: (jsonStr) =>
    {
      const j = JSON.parse(jsonStr);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(j.ct),
      });
      if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
      if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
      return cipherParams;
    },
  };


/**
 * Encrypt text
 * CryptoJS 3.x AES encryption/decryption on client side with Javascript and on server side with PHP
 * https://github.com/brainfoolong/cryptojs-aes-php
 *
 * @since 3.7.0
 * @static
 * @memberof string
 * @param {string} text handle string or object (convert to JSON)
 * @param {string} password
 * @return {string}
 * @example
 *
 * encrypt('hello world', 'password');
 */
const encrypt = (text: string, password: string): string =>
  CryptoJS.AES
    .encrypt(JSON.stringify(text), password, { format })
    .toString();

export default encrypt;
