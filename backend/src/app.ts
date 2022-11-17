import Koa from "koa";
import bodyParser from "koa-body";
import router from "./routes";

const app: Koa = new Koa();

// 解析 request body:
app.use(bodyParser());

// 路由
app.use(router.routes()).use(router.allowedMethods());

const port: number = 9000;
app.listen(port, () => {
  console.log(`seccess start server`);
  console.log(`local: http://127.0.0.1:${port}`);
});
