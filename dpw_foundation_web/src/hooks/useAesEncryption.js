import CryptoJS from 'crypto-js';
import { useCallback, useState } from 'react';

/**
 * Custom hook for AES encryption and decryption.
 * This hook encrypts and decrypts text using AES with a secret key from the environment variables.
 *
 * @returns {object} - An object containing encryptedText, decryptedText, and encryption/decryption functions.
 */
const useAesEncryption = () => {
  const secretKey = process.env.SECRET_KEY; // Fetch the secret key from environment variables
  const SECRET_KEY = CryptoJS.enc.Base64?.parse(secretKey); // Parse the secret key to Base64 format using CryptoJS
  const [encryptedText, setEncryptedText] = useState(''); // State to store the encrypted text
  const [decryptedText, setDecryptedText] = useState(''); // State to store the decrypted text

  /**
   * Memoized function to encrypt text.
   *
   * @param {string} text - The text to be encrypted.
   * @returns {string} - The encrypted text.
   */
  const encrypt = useCallback(
    (text) => {
      if (!text || !secretKey) return ''; // Return empty string if no text or secret key is provided
      const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY, {
        mode: CryptoJS.mode.ECB, // Using ECB (Electronic Codebook) mode for AES encryption
        padding: CryptoJS.pad.Pkcs7 // Using Pkcs7 padding for AES encryption
      });
      setEncryptedText(encrypted.toString()); // Update the state with the encrypted text
      return encrypted.toString(); // Return the encrypted text as string
    },
    [secretKey] // Dependency on the secretKey value for re-calculating the encryption
  );

  /**
   * Memoized function to decrypt the encrypted text.
   *
   * @param {string} cipherText - The encrypted text to be decrypted.
   * @returns {string} - The original decrypted text.
   */
  const decrypt = useCallback(
    (cipherText) => {
      if (!cipherText || !SECRET_KEY) return ''; // Return empty string if no cipher text or secret key is provided
      const originalText = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
        mode: CryptoJS.mode.ECB, // Using ECB mode for AES decryption
        padding: CryptoJS.pad.Pkcs7 // Using Pkcs7 padding for AES decryption
      });
      setDecryptedText(originalText.toString(CryptoJS.enc.Utf8)); // Convert decrypted text back to UTF-8 and update the state
      return originalText.toString(CryptoJS.enc.Utf8); // Return the decrypted text as UTF-8 string
    },
    [secretKey] // Dependency on the secretKey value for re-calculating the decryption
  );

  return {
    encryptedText, // Return the encrypted text
    decryptedText, // Return the decrypted text
    encrypt, // Return the encrypt function
    decrypt // Return the decrypt function
  };
};

export default useAesEncryption;
