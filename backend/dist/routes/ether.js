"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const ether_1 = __importDefault(require("../controller/ether"));
const router = new koa_router_1.default();
router.get("/getBalance", ether_1.default.getBalance);
router.get("/test", ether_1.default.test); // TODO: post
exports.default = router;
