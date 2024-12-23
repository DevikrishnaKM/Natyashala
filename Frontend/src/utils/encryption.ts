import { CRYPTO_KEY } from "../credentials";
import CryptoJS from "crypto-js";

const encrypt = (data:object) => {
    try {
        const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTO_KEY).toString(); 
        console.log(cipherText,"cipherText")
        return cipherText; // Cryptojs.AES.encrypt(data, CRYPTO_KEY).toString(); 
    } catch (error) {
      console.error("Encryption error:", error);
       throw error;
    }
}



const decrypt = (ciphertext: any) => {
  try {
    if (!ciphertext || typeof ciphertext !== 'string') {
      throw new Error("Decryption failed: No valid ciphertext found.");
    }

    console.log("Ciphertext to decrypt:", ciphertext); // Log to see the actual data

    const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    console.log("Decrypted Data:", decryptedData); // Log decrypted data

    if (!decryptedData) {
      throw new Error("Decryption failed or malformed data.");
    }

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Return null or handle it appropriately
  }
};



export {encrypt, decrypt}