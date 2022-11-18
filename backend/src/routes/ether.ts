import Router from "koa-router";
import etherController from "../controller/ether";

const router = new Router();

router.get("/getBalance", etherController.getBalance);
router.get("/test", etherController.test); // TODO: post

export default router;
