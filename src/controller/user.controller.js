import con from "../config/db.js";
import { EMessage, Role, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import {
  Decrypt,
  GeneratePassword,
  GenerateToken,
} from "../service/service.js";
import { ValidateData } from "../service/validate.js";

export default class UserController {
  static async getAll(req, res) {
    try {
      const mysql = "select * from user";
      con.query(mysql, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound + " user");
        return SendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getOne(req, res) {
    try {
      const UID = req.params.UID;
      const mysql = "select * from user where UID=?";
      con.query(mysql, UID, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound + " user");
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getUserInfo(req, res) {
    try {
      const UID = req.user;
      const mysql = "select * from user where UID=?";
      con.query(mysql, UID, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound + " user");
        return SendSuccess(res, SMessage.selectOne, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
 
  static async register(req, res) {
    try {
      const { username, password } = req.body;
      const validate = await ValidateData({ username, password });
      if (validate.length > 0) {
        return SendError(res, 400, "Please input: " + validate.join(","));
      }
      var datetime = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");

      const mysql = "Select * from user where username=?";
      con.query(mysql, username, async function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
          return SendError(res, 400, "username is already!");
        }
        const genPassword = await GeneratePassword(password);
        const insert =
          "insert into user (username,password,role,createdAt,updatedAt) values (?,?,?,?,?)";
        con.query(
          insert,
          [username, genPassword, Role.employee, datetime, datetime],
          async function (error, data) {
            if (error) throw error;
            return SendCreate(res, SMessage.Register);
          }
        );
      });
    } catch (error) {
      return SendError(res, 500, "ErrorServer Internal", error);
    }
  }
  static login(req, res) {
    try {
      const { username, password } = req.body;
      const validate = ValidateData({ username, password });
      if (validate.length > 0) {
        return SendError(res, 400, "Please input: " + validate.join(","));
      }

      const mysql = "Select * from user where username=?";
      con.query(mysql, username, async function (err, result) {
        if (err) throw err;

        if (result[0] === null || result[0] === undefined) {
          return res
            .status(404)
            .json({ success: false, message: "username and password invaild" });
        }
        const decryptPassword = await Decrypt(result[0]["password"]);

        if (password != decryptPassword) {
          return SendError(res, 401, "Password Not Match");
        }

        var data = {
          id: result[0]["UID"],
          role: Role.employee,
        };
        const token = await GenerateToken(data);
        const newData = Object.assign(
          JSON.parse(JSON.stringify(result[0])),
          JSON.parse(JSON.stringify(token))
        );
        return SendSuccess(res, SMessage.Login, newData);
      });
    } catch (error) {
      return SendError(res, 500, "ErrorServer Internal", error);
    }
  }
  static async UpdateUser(req, res) {
    try {
      const UID = req.params.UID;
      const mysql = "Select * from user where UID=?";

      const { username } = req.body;
      con.query(mysql, UID, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound + " user");
        const update = "UPDATE user set username =? WHERE UID =?";
        con.query(update, [username, UID], function (error, result) {
          if (error) return SendError(res, 400, "Faild Update User", error);
          return SendSuccess(res, SMessage.updated);
        });
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async deleteUser(req, res) {
    try {
      const UID = req.params.UID;
      const mysql = `DELETE FROM user WHERE UID = ?`;
      con.query(mysql, UID, function (err) {
        if (err) throw err;
        return SendSuccess(res, SMessage.delete);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
}
