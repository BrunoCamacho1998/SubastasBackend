"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubastaRouter = void 0;
const express_1 = require("express");
const subasta_controller_1 = __importDefault(require("../../controllers/subasta.controller"));
class SubastaRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.init();
    }
    init() {
        this.router.get('/obtenerSubastantes/:subastaID', subasta_controller_1.default.getSubastantes);
        this.router.post('/crearEvento', subasta_controller_1.default.agregarEvento);
        this.router.post('/guardarActualizarSubastaUsuario', subasta_controller_1.default.guardarOActualizarSubastaUsuario);
        this.router.post('/finalizarSubasta/:subastaID', subasta_controller_1.default.finalizarSubasta);
        this.router.post('/descargarGanadores', subasta_controller_1.default.downloadWinners);
    }
}
exports.SubastaRouter = SubastaRouter;
const privateRoute = new SubastaRouter();
exports.default = privateRoute.router;
