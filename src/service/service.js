import CryptoJS from "crypto-js";
import { SecreatKey } from "../config/globalKey.js";
import jwt from "jsonwebtoken";
export const GeneratePassword = async (password) => {
  const encryptPassword = CryptoJS.AES.encrypt(password, SecreatKey).toString();
  return encryptPassword;
};
export const GenerateToken = async (data) => {
  var paylod = {
    id: await encrypt(data.id.toString()),
    role: await encrypt(data.role),
  };
  var paylod_refresh = {
    id: await encrypt(data.id.toString()),
    role: await encrypt(paylod.role),
  };
  const token = jwt.sign(paylod, SecreatKey, { expiresIn: "2h" });
  const refreshToken = jwt.sign(paylod_refresh, SecreatKey, {
    expiresIn: "1d",
  });

  return { token, refreshToken };
};
export const encrypt = async (data) => {
  const encrypt = CryptoJS.AES.encrypt(data, SecreatKey).toString();
  return encrypt;
};
export const Decrypt = async (data) => {
  const decrypt = CryptoJS.AES.decrypt(data, SecreatKey);
  const result = decrypt.toString(CryptoJS.enc.Utf8);
  return result;
};
