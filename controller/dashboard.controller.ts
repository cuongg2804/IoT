import { Request, Response } from "express";
import { initMqtt } from "../config/mqtt";

export const dashboard = (req: Request, res: Response) => { 
  
  res.render("dashboard.html");
}