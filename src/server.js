import express from "express"; // ES
import  "./config/db.js";
import routes from "./router/route.js";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();


app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(
  bodyParser.urlencoded({ 
    extended: true, 
    limit: "500mb", parameterLimit: 500
 })
);
app.use("/api", routes);
app.listen(3001, () => {
  console.log(`Server is port http://localhost:3001`);
});
