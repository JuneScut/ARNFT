import Router from "koa-router";
import EtherRoute from "./ether";

const router = new Router();

router.use("/ether", EtherRoute.routes());

export default router;
