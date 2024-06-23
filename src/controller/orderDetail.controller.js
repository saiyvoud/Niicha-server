import { UploadToCloudinary } from "../config/cloudinary.js";
import con from "../config/db.js";
import { EMessage, OrderStatus, SMessage } from "../service/message.js";
import { SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";

export default class OrderDetailController {
  static async getAll(req, res) {
    try {
      const order_detail = "select * from order_detail";
      con.query(order_detail, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getOne(req, res) {
    try {
      const ODID = req.params.ODID;
      const mysql = "select * from order_detail where ODID=?";
      con.query(mysql, ODID, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }

  static async insert(req, res) {
    try {
      const { orders_id, product_id, qty, total } = req.body;
      const validate = await ValidateData({
        orders_id,
        product_id,
        qty,
        total,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }

      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      const checkTable = "Selece * from orders where OID=?";
      con.query(checkTable, orders_id, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound + " order");
        if (!result[0])
          return SendError(res, 404, EMessage.NotFound + " order");
        const mysql =
          "insert into orders (orders_id, product_id,qty,total,createdAt,updatedAt) values (?,?,?,?,?)";
        con.query(
          mysql,
          [orders_id, product_id, qty, total, dateTime, dateTime],
          (err) => {
            if (err) return SendError(res, 404, EMessage.ErrorInsert, err);
            return SendSuccess(res, SMessage.Insert);
          }
        );
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }

  static async deleteOrderDetail(req, res) {
    try {
      const OID = req.params.OID;
      const update = "delete from order_detail where ODID=?";
      con.query(update, OID, (err) => {
        if (err) return SendError(res, 404, EMessage.ErrorDelete);
        return SendSuccess(res, SMessage.updated);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
}
