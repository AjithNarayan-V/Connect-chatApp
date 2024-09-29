import { Router } from "express";
import { signup ,login,getUserInfo,profile} from "../controller/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.put("/login", login);
authRoutes.get("/user-info",verifyToken ,getUserInfo);
authRoutes.post("/profile", verifyToken,profile);
export default authRoutes;