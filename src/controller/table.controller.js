import con from "../config/db.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";

export default class TableController {
  static async getAll(req, res) {
    try {
      const table = "select * from table";
      con.query(table, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getOneByNoTable(req, res) {
    try {
      const noTable = req.params.noTable;
      const mysql = "select * from table where noTable=?";
      con.query(mysql, noTable, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getOne(req, res) {
    try {
      const tableId = req.params.tableId;
      const mysql = "select * from table where TID=?";
      con.query(mysql, tableId, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async insert(req, res) {
    try {
      const { noTable, url, seatAmount } = req.body;
      const validate = await ValidateData({ noTable, url, seatAmount });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      const insert =
        "insert into table (noTable,url,seatAmount,createdAt,updatedAt) values (?,?,?,?,?)";
      con.query(
        insert,
        [noTable, url, seatAmount, dateTime, dateTime],
        (err) => {
          if (err) return SendError(res, 400, EMessage.ErrorInsert, err);
          return SendSuccess(res, SMessage.Insert);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async updateTable(req, res) {
    try {
      const TID = req.params.TID;
      const { noTable, url, seatAmount } = req.body;
      const validate = await ValidateData({ noTable, url, seatAmount });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      const mysql = "select * from table where TID=?";
      const update =
        "update table set noTable=?,url=? ,seatAmount=?,updatedAt=? where TID=?";
      con.query(mysql, tableId, function (err, result) {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound, err);
        con.query(
          update,
          [noTable, url, seatAmount, dateTime, TID],
          (error) => {
            if (error) return SendError(res, 400, EMessage.ErrorUpdate, error);
            return SendSuccess(res, SMessage.updated);
          }
        );
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async deleteTable(req, res) {
    try {
      const TableId = req.params.TableId;
      const check = "select * from Table where TID=?";
      const deletes = "Delete from Table where TID=?";
      con.query(check, TableId, (err) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        con.query(deletes, TableId, (error) => {
          if (error) return SendError(res, 400, EMessage.ErrorDelete, error);
          return SendSuccess(res, SMessage.updated);
        });
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
}
