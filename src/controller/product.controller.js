import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import con from "../config/db.js";
import { UploadToCloudinary } from "../config/cloudinary.js";
export default class ProductController {
  static async getAll(req, res) {
    try {
      const product = "select * from product";
      con.query(product, function (err, result) {
        if(err) console.log(err);
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectAll, result);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async getOne(req, res) {
    try {
      const productId = req.params.productId;
      const mysql = "select * from product where PID=?";
      con.query(mysql, productId, function (err, result) {
        if (err) return SendError(res, 400, EMessage.NotFound, err);
        return SendSuccess(res, SMessage.selectOne, result[0]);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async searchProduct(req,res){
    try {
     // const page = parseInt(`${req.query.page}`);
      const { search } = req.query;
     // const offset = page && page > 0 ? page - 1 : 0;
      const searchProduct = `select * from product where name LIKE %${search}%`;
      con.query(searchProduct,function(err,result){
        if(err) return SendError(res,EMessage.NotFound,err);
        if(!result[0])  return SendError(res,EMessage.NotFound,err);
        return SendSuccess(res,SMessage.selectAll,result);
      })
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async insert(req, res) {
    try {
      const { product_type, name, detail, price } = req.body;
      const validate = await ValidateData({
        product_type,
        name,
        detail,
        price,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const file = req.files;
      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      const image_url = await UploadToCloudinary(file.file.data);
      if (!image_url) {
        return SendError(res, 404, "Error Upload Image");
      }
      const mysql =
        "insert into product (product_type,name,detail,price,image,createdAt,updatedAt) values (?,?,?,?,?,?,?)";
      con.query(
        mysql,
        [product_type, name, detail, price, image_url, dateTime, dateTime],
        function (err) {
          if (err) return SendError(res, 400, EMessage.ErrorInsert, err);
          return SendCreate(res, SMessage.Insert);
        }
      );
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async updateProduct(req, res) {
    try {
      const { PID } = req.params;
      const { product_type, name, detail, price } = req.body;
      const validate = await ValidateData({
        product_type,
        name,
        detail,
        price,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      const file = req.files;
      const image_url = await UploadToCloudinary(file.file.data);
      if (!image_url) {
        return SendError(res, 404, "Error Upload Image");
      }
      const checkProductType = "select * from product_type where PTID=?";
      con.query(checkProductType, product_type, (err) => {
        if (err) return SendError(res, 400, EMessage.ErrorUpdate, err);
        var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
        const update =
          "update product set product_type=?,name=?,detail=? ,price=? ,image=?,updatedAt=? Where PID=? ";
        con.query(
          update,
          [product_type, name, detail, price, image_url, dateTime, PID],
          (err) => {
            if (err) return SendError(res, EMessage.ErrorUpdate, err);
            return SendSuccess(res, SMessage.updated);
          }
        );
      });
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async deleteProduct(req, res) {
    try {
      const productId = req.params.productId;
      const check = "select * from product where PID=?";
      const deletes = "Delete from product where PID=?";
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
