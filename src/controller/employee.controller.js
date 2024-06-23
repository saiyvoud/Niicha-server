import { ValidateData } from "../service/validate.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { EMessage, SMessage } from "../service/message.js";
import con from "../config/db.js";
export default class EmployeeController {
  static async getAll(req, res) {
    try {
      const order = "select * from employee";
      con.query(order, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getOne(req, res) {
    try {
      const EID = req.params.EID;
      const mysql = "select * from employee where EID=?";
      con.query(mysql, EID, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async insert(req, res) {
    try {
      const { firstname, lastname, gender, birthday, address, phoneNumber } =
        req.body;
      const validate = await ValidateData({
        firstname,
        lastname,
        gender,
        birthday,
        address,
        phoneNumber,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const mysql =
        "insert into employee (firstname,lastname,gender,birthday,address,phoneNumber,createdAt,updatedAt) values (?,?,?,?,?,?,?,?)";
      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      con.query(
        mysql,
        [
          firstname,
          lastname,
          gender,
          birthday,
          address,
          phoneNumber,
          dateTime,
          dateTime,
        ],
        (err) => {
          if (err) return SendError(res, 400, EMessage.ErrorInsert, err);
          return SendCreate(res, SMessage.Insert);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }

  static async updateEmployee(req, res) {
    try {
      const EID = req.params.EID;

      const { firstname, lastname, gender, birthday, address, phoneNumber } =
        req.body;
      const validate = await ValidateData({
        firstname,
        lastname,
        gender,
        birthday,
        address,
        phoneNumber,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      const mysql = "select * from employee where EID=?";
      const update =
        "Update employee set firstname=?,lastname=?,gender=?,birthday=?,address=?,phoneNumber=?,updatedAt=? where EID=?";
      con.query(mysql, EID, function (err, result) {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        con.query(
          update,
          [
            firstname,
            lastname,
            gender,
            birthday,
            address,
            phoneNumber,
            dateTime,
            EID,
          ],
          (error) => {
            if (error) return SendError(res, 400, EMessage.ErrorUpdate, err);
            return SendSuccess(res, SMessage.updated);
          }
        );
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async deleteEmployee(req, res) {
    try {
      const EID = req.params.EID;
      const check = "select * from employee where EIP=?";
      con.query(check, EID, function (err, result) {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound, err);
        const deleteEmployee = "delete from employee where EID=?";
        con.query(deleteEmployee, EID, function (error) {
          if (err) SendError(res, 404, EMessage.ErrorDelete, err);
          return SendSuccess(res, SMessage.delete);
        });
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
}
