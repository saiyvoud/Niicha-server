import express from "express";
import EmployeeController from "../controller/employee.controller.js";
import OrderController from "../controller/order.controller.js";
import OrderDetailController from "../controller/orderDetail.controller.js";
import ProductController from "../controller/product.controller.js";
import ProductTypeController from "../controller/productType.controller.js";
import TableController from "../controller/table.controller.js";
import UserController from "../controller/user.controller.js";
const routes = express.Router();
// ======== user ======
routes.get("/user/getAll",UserController.getAll);
routes.get("/user/getOne/:UID",UserController.getOne);
routes.post("/user/login",UserController.login);
routes.post("/user/register",UserController.register);
routes.put("/user/update/:UID",UserController.UpdateUser);
routes.delete("/user/delete/:UID",UserController.deleteUser)
// ======== product_type ====
routes.get("/product_type/getAll",ProductTypeController.getAll);
routes.get("/product_type/getOne/:PTID",ProductTypeController.getOne);
routes.post("/product_type/insert",ProductTypeController.insert);
routes.put("/product_type/update/:PTID",ProductTypeController.updateProductType);
routes.delete("/product_type/delete/:PTID",ProductTypeController.deleteProductType);
// ======== product ========
routes.get("/product/getAll",ProductController.getAll);
routes.get("/product/getOne/:PID",ProductController.getOne);
routes.post("/product/insert",ProductController.insert);
routes.put("/product/update/:PID",ProductController.updateProduct);
routes.delete("/product/delete/:PID",ProductController.deleteProduct);
// ======= table =======
routes.get("/tables/getAll",TableController.getAll);
routes.get("/tables/getOne/:TID",TableController.getOne);
routes.post("/tables/insert",TableController.insert);
routes.put("/tables/update/:TID",TableController.updateTable);
routes.delete("/tables/delete/:TID",TableController.deleteTable);
// ======== orders =======
routes.get("/order/getAll",OrderController.getAll);
routes.get("/order/getOne/:OID",OrderController.getOne);
routes.post("/order/insert",OrderController.insert);
routes.put("/order/update/:OID",OrderController.updateOrderStatus);
routes.delete("/order/delete/:OID",OrderController.deleteOrder);
// ======== order detail =======
routes.get("/order/getAll",OrderDetailController.getAll);
routes.get("/order/getOne/:ODID",OrderDetailController.getOne);
routes.post("/order/insert",OrderDetailController.insert);
routes.delete("/order/delete/:ODID",OrderDetailController.deleteOrderDetail);
//========= Employee =======
routes.get("/employee/getAll",EmployeeController.getAll);
routes.get("/employee/getOne/:EID",EmployeeController.getOne);
routes.post("/employee/insert",EmployeeController.insert);
routes.put("/employee/update/:EID",EmployeeController.updateEmployee);
routes.delete("/employee/delete/:EID",EmployeeController.deleteEmployee);
export default routes;