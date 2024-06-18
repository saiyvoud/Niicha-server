import express from "express";
import ProductController from "../controller/product.controller.js";
import ProductTypeController from "../controller/productType.controller.js";
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
routes.post("/product_type/login",ProductTypeController.insert);
routes.put("/product_type/update/:PTID",ProductTypeController.updateProductType);
routes.delete("/product_type/delete/:PTID",ProductTypeController.deleteProductType);
// ======== product ========
routes.get("/product/getAll",ProductController.getAll);
routes.get("/product/getOne/:PID",ProductController.getOne);
routes.post("/product/login",ProductController.insert);
routes.put("/product/update/:PID",ProductController.updateProductType);
routes.delete("/product/delete/:PID",ProductController.deleteProductType);

export default routes;