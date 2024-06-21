import con from "../config/db.js";
import { EMessage, SMessage } from "../service/message.js";
import { SendError, SendSuccess } from "../service/response.js";

export default class ProductTypeController {
  static async getAll(req, res) {
    try {
      const product_type = "select * from product_type";
      con.query(product_type, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getOne(req, res) {
    try {
      const PTID = req.params.PTID;
      const mysql = "select * from product_type where PTID=?";
      con.query(mysql, PTID, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async insert(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return SendError(res, 400, EMessage.BadRequest + " name");
      }
      const mysql =
        "insert into product_type (name,createdAt,updatedAt) values (?,?,?)";
      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      con.query(mysql, [name, dateTime, dateTime], (err) => {
        if (err) return SendError(res, 400, EMessage.ErrorInsert, err);
        return SendSuccess(res, SMessage.Insert);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async updateProductType(req, res) {
    try {
      const PTID = req.params.PTID;
      const { name } = req.body;
       if(!name){
        return SendError(res,400,EMessage.BadRequest + " name")
       }
      const checkProductType = "select * from product_type where PTID=?";
      con.query(checkProductType, PTID, (err) => {
        if (err) return SendError(res, 400, EMessage.ErrorUpdate, err);
        const update =
          "update prduct_type set name=?,updatedAt=? Where PTID=?";
          var dateTime = new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");
        con.query(
          update,
          [ name, PTID,dateTime],
          (err) => {
            if (err) return SendError(err, 400, EMessage.ErrorUpdate, err);
            return SendSuccess(res, SMessage.updated);
          }
        );
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async deleteProductType(req, res) {
    try {
      const productId = req.params.productId;
      const check = "select * from product_type where PTID=?";
      const deletes = "Delete from product_type where PTID=?";
      con.query(check, productId, (err) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        con.query(deletes, productId, (error) => {
          if (error) return SendError(res, 400, EMessage.ErrorDelete, error);
          return SendSuccess(res, SMessage.updated);
        });
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
}
