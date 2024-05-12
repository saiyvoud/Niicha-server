import express from "express";
import UserController from "../controller/user.controller.js";
const routes = express.Router();
// ======== user ======
routes.post("/user/login",UserController.login);
routes.post("/user/register",UserController.register);
export default routes;