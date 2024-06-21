import { UploadToCloudinary } from "../config/cloudinary.js";
import con from "../config/db.js";
import { EMessage, OrderStatus, SMessage } from "../service/message.js";
import { SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";

export default class OrderController {
  static async getAll(req, res) {
    try {
      const order = "select * from orders";
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
      const OID = req.params.OID;
      const mysql = "select * from orders where OID=?";
      con.query(mysql, OID, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async insert(req, res) {
    try {
      const { table_id, totalPrice } = req.body;
      const validate = await ValidateData({ table_id, totalPrice });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const file = req.files;
      const image_url = await UploadToCloudinary(file.billQR.data);
      if (!image_url) return SendError(res, 404, EMessage.ErrorUploadImage);

      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      const checkTable = "Selece * from tables where TID=?";
      con.query(checkTable, table_id, (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound + " table");
        if (!result[0])
          return SendError(res, 404, EMessage.NotFound + " table");
        const mysql =
          "insert into orders (table_id,totalPrice,billOR,status,createdAt,updatedAt) values (?,?,?,?,?)";
        con.query(
          mysql,
          [
            table_id,
            totalPrice,
            image_url,
            OrderStatus.pedding,
            dateTime,
            dateTime,
          ],
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
  static async updateOrderStatus(req, res) {
    try {
      const OID = req.params.OID;
      const { status } = req.body;
      if (!status) {
        return SendError(res, 400, EMessage.BadRequest + "status");
      }
      const update = "update orders set status=? where OID=?";
      con.query(update, [status, OID], (err) => {
        if (err) return SendError(res, 404, EMessage.ErrorUpdate);
        return SendSuccess(res, SMessage.updated);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async deleteOrder(req, res) {
    try {
      const OID = req.params.OID;
      const update = "delete from orders where OID=?";
      con.query(update, OID, (err) => {
        if (err) return SendError(res, 404, EMessage.ErrorDelete);
        return SendSuccess(res, SMessage.updated);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
}
