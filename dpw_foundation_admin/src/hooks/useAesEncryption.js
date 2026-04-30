import CryptoJS from 'crypto-js';
import { useCallback, useState } from 'react';

/**
 * Custom hook for AES encryption and decryption using the CryptoJS library.
 * The secret key is accessed from environment variables.
 *
 * @returns {Object} - An object containing:
 *                     - `encryptedText` {string}: The last encrypted text.
 *                     - `decryptedText` {string}: The last decrypted text.
 *                     - `encrypt` {Function}: Function to encrypt a given text.
 *                     - `decrypt` {Function}: Function to decrypt a given cipher text.
 */
const useAesEncryption = () => {
  // Access the secret key from environment variables
  const secretKey = process.env.SECRET_KEY;
  const SECRET_KEY = CryptoJS.enc.Base64.parse(secretKey);

  // State to hold the last encrypted and decrypted text
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  /**
   * Encrypts a given text using AES encryption.
   *
   * @param {string} text - The plain text to encrypt.
   * @returns {string} - The encrypted text in Base64 format.
   */
  const encrypt = useCallback(
    (text) => {
      if (!text || !secretKey) return ''; // Return an empty string if input or secret key is missing
      const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const encryptedString = encrypted.toString();
      setEncryptedText(encryptedString); // Store the encrypted text in state
      return encryptedString;
    },
    [secretKey, SECRET_KEY]
  );

  /**
   * Decrypts a given cipher text using AES decryption.
   *
   * @param {string} cipherText - The encrypted text to decrypt.
   * @returns {string} - The decrypted plain text.
   */
  const decrypt = useCallback(
    (cipherText) => {
      if (!cipherText || !SECRET_KEY) return ''; // Return an empty string if input or secret key is missing
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      setDecryptedText(originalText); // Store the decrypted text in state
      return originalText;
    },
    [SECRET_KEY]
  );

  return {
    encryptedText,
    decryptedText,
    encrypt,
    decrypt
  };
};

export default useAesEncryption;
