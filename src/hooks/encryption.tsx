import CryptoJS from 'react-native-crypto-js'

const createCypher = (text: string, key: string) : string => {
    let ciphertext = CryptoJS.AES.encrypt(text, key).toString();
    return ciphertext;
};

const decryptCypher = (text: string, key: string) : string => {
    let bytes  = CryptoJS.AES.decrypt(text, key);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

export { createCypher, decryptCypher }