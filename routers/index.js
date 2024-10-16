"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
const express_1 = require("express");
const service_router_1 = __importDefault(require("./api/service.router"));
class Routers {
    constructor() {
        this.router = (0, express_1.Router)();
        this.init();
    }
    init() {
        this.router.use('/subasta', service_router_1.default);
        this.router.post('/info', (req, res) => {
            res.status(200).send('Hola The Move Calling Api');
        });
    }
}
exports.Routers = Routers;
const router = new Routers();
exports.default = router.router;
