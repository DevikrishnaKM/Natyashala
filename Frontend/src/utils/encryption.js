import { CRYPTO_KEY } from "../credentials";
import Cryptojs from "crypto-js";

const encrypt = (data) => {
    try {
        const cipherText = Cryptojs.AES.encrypt(JSON.stringify(data), CRYPTO_KEY).toString(); 
        return cipherText; // Cryptojs.AES.encrypt(data, CRYPTO_KEY).toString(); 
    } catch (error) {
      console.error("Encryption error:", error);
       throw error;
    }
}

const decrypt = (cipherText) => {
    try {
        const bytes = Cryptojs.AES.decrypt(cipherText, CRYPTO_KEY);
        const decryptedData = bytes.toString(Cryptojs.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error("Decryption error:", error);
        throw error;
    }
}

export {encrypt, decrypt}