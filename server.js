"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routers_1 = __importDefault(require("./routers"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '../src/assets')));
        this.app.listen(process.env.PORT, () => console.log(`App listen in port ${process.env.PORT} and host ${process.env.DB_HOST}`));
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            origin: '*',
            methods: '*',
            allowedHeaders: 'Content-Type',
        }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
    }
    endpoints() {
        this.app.use('/api', routers_1.default);
    }
}
exports.default = Server;
