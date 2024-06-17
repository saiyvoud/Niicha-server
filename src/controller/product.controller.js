import { EMessage, SMessage } from "../service/message";
import { SendCreate, SendError, SendSuccess } from "../service/response";
import { ValidateData } from "../service/validate";
import con from "../config/db";
export default class ProductController {
  static async getAll(req, res) {
    try {
      const product = "select * from product";
      con.query(product, function (err, result) {
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
  static async insert(req, res) {
    try {
      const { product_type, name, detail, price, image } = req.body;
      const validate = await ValidateData({
        product_type,
        name,
        detail,
        price,
        image,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.PleaseInput + validate.join(","));
      }
      var dateTime = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, "");
      const mysql =
        "insert into product (product_type,name,detail,price,image,createdAt,updatedAt) values (?,?,?,?,?,?,?)";
      con.query(
        mysql,
        [product_type, name, detail, price, image, dateTime, dateTime],
        function (err) {
          if (err) return SendError(res, 400, EMessage.ErrorInsert, err);
          return SendCreate(res, SMessage.Insert);
        }
      );
    } catch (error) {
      return SendError(res, 500, EMessage.Server, error);
    }
  }
  static async updateProduct(req,res){
    try {
        const productId = req.params.productId;
        const {product_type,name,detail,price} = req.body;
        const validate = await ValidateData({product_type,name,detail,price})
        if(validate.length > 0){
            return SendError(res,400,EMessage.PleaseInput+validate.join(","));
        }
        const update = "update prduct set PID=?,product_type=?,name=?,detail=? ,price=? ,image=?,createdAt=?,updatedAt=?";
        con.query(update,[productId,product_type,name,detail,price,ima]) 
    } catch (error) {
        
    }
  }
}
