import { Router, type IRouter } from "express";
import healthRouter from "./health";
import organiserRouter from "./organiser";
import authRouter from "./auth";
import profileRouter from "./profile";
import storageRouter from "./storage";
import eventsRouter from "./events";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(organiserRouter);
router.use(profileRouter);
router.use(storageRouter);
router.use(eventsRouter);

export default router;
