"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subasta_service_1 = __importDefault(require("../services/subasta.service"));
class SubastaController {
    static async getSubastantes(req, res) {
        try {
            const response = await subasta_service_1.default.obtenerSubastantes(req);
            res.status(200).json({
                status: true,
                data: response
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res?.status(400).json({
                    status: false,
                    error: {
                        code: 400,
                        message: error.message
                    }
                });
            }
        }
    }
    static async agregarEvento(req, res) {
        try {
            const response = await subasta_service_1.default.createEvento(req);
            res.status(200).json({
                status: true,
                data: response
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res?.status(400).json({
                    status: false,
                    error: {
                        code: 400,
                        message: error.message
                    }
                });
            }
        }
    }
    static async guardarOActualizarSubastaUsuario(req, res) {
        try {
            const response = await subasta_service_1.default.guardarOActualizarSubastaUsuario(req);
            res.status(200).json({
                status: true,
                data: response
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res?.status(400).json({
                    status: false,
                    error: {
                        code: 400,
                        message: error.message
                    }
                });
            }
        }
    }
    static async finalizarSubasta(req, res) {
        try {
            const response = await subasta_service_1.default.finalizarSubasta(req);
            res.status(200).json({
                status: true,
                data: response
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res?.status(400).json({
                    status: false,
                    error: {
                        code: 400,
                        message: error.message
                    }
                });
            }
        }
    }
    static async downloadWinners(req, res) {
        try {
            const workbook = await subasta_service_1.default.descargarGanadores();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'data.xlsx');
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log({ error, message: error.message });
                res?.status(400).json({
                    status: false,
                    error: {
                        code: 400,
                        message: error.message
                    }
                });
            }
        }
    }
}
exports.default = SubastaController;
