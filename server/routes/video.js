import express from "express";
import { getallvideo, uploadvideo ,handleDownload } from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";

const routes = express.Router();

routes.post("/upload", upload.single("file"), uploadvideo);
routes.get("/getall", getallvideo);
routes.post("/download", handleDownload);
export default routes;