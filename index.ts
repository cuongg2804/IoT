import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./router/index.router";
import * as database from "./config/database";

dotenv.config();

const app = express();

database.connect();
app.use(router)
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.set("views", `${__dirname}/view`);
app.use(express.static(`${__dirname}/public/`));



app.listen(3000, () => {
  console.log("Connected to port 3000");
});
