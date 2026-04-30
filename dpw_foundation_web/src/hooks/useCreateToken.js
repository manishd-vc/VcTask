// hooks/useCreateToken.js
import CryptoJS from 'crypto-js';
import { useCallback } from 'react';

const base64UrlEncode = (str) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
    .replace(/={1,2}$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const base64UrlEncodeRaw = (wordArray) => {
  return CryptoJS.enc.Base64.stringify(wordArray)
    .replace(/={1,2}$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export default function useCreateToken() {
  const secret = process.env.ENCRYPT_SECRET || 'n8Fz2Qw4r7Tg6Yp9s3Vb1Xc5Lm0Jk8Zq'; // Default secret if not provided
  const createToken = useCallback(
    (payload) => {
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };

      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedPayload = base64UrlEncode(JSON.stringify(payload));

      const data = `${encodedHeader}.${encodedPayload}`;
      const signature = CryptoJS.HmacSHA256(data, secret);
      const signatureEncoded = base64UrlEncodeRaw(signature);

      return `${data}.${signatureEncoded}`;
    },
    [secret]
  );

  return createToken;
}
