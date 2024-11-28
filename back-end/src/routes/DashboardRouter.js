import {Router } from "express";
import {getDashboard} from "../controllers/DashBoardControllers.js"
const DashboardRouter = Router();
DashboardRouter.get('/', getDashboard)
export default DashboardRouter