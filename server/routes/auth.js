import express from "express"
import { login, updateprofile } from "../controllers/Auth.js";
const routes = express.Router();

routes.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, login);
routes.patch("/update/:id", updateprofile);
export default routes;