"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const routes_1 = __importDefault(require("./routes"));
const app = new koa_1.default();
// 解析 request body:
app.use((0, koa_body_1.default)());
// 路由
app.use(routes_1.default.routes()).use(routes_1.default.allowedMethods());
const port = 9000;
app.listen(port, () => {
    console.log(`seccess start server`);
    console.log(`local: http://127.0.0.1:${port}`);
});
