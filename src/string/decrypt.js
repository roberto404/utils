// @flow

// 55 KB
import CryptoJS from 'crypto-js';

import { format } from './encrypt';

/**
 * Decrypt text
 * CryptoJS 3.x AES encryption/decryption on client side with Javascript and on server side with PHP
 * https://github.com/brainfoolong/cryptojs-aes-php
 *
 * @since 3.7.0
 * @static
 * @memberof string
 * @param {string} text handle crypted string
 * @param {string} password
 * @return {string}
 * @example
 *
 * decrypt('ABCDEFG', 'password');
 */
const decrypt = (text: string, password: string): string =>
  JSON.parse(
    CryptoJS.AES
      .decrypt(text, password, { format })
      .toString(CryptoJS.enc.Utf8),
  );


export default decrypt;
