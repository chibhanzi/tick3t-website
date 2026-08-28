import { Router, type IRouter } from "express";
import healthRouter from "./health";
import organiserRouter from "./organiser";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(organiserRouter);

export default router;
