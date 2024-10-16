"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lite_1 = require("firebase/firestore/lite");
const firebase_1 = __importDefault(require("./firebase"));
const Excel = require('exceljs');
class SubastaService {
    static async obtenerSubastantes(req) {
        const { subastaID } = req.params;
        const SubaCollect = await (0, lite_1.collection)(firebase_1.default, "Subastantes");
        const consulta = (0, lite_1.query)(SubaCollect, (0, lite_1.where)('Activo', '==', true), (0, lite_1.where)('SubastaID', '==', subastaID));
        const snapchot = await (0, lite_1.getDocs)(consulta);
        const subastantes = [];
        snapchot.forEach((doc) => {
            subastantes.push({ id: doc.id, ...doc.data() });
        });
        return subastantes;
    }
    static async createEvento(req) {
        const { subastaID } = req.body;
        const date = new Date(Date.now());
        const subastasRef = await (0, lite_1.collection)(firebase_1.default, "Subastas");
        const consulta = (0, lite_1.query)(subastasRef, (0, lite_1.where)('SubastaID', '==', subastaID), (0, lite_1.where)('Activo', '==', true));
        const snapshot = await (0, lite_1.getDocs)(consulta);
        if (snapshot.empty) {
            const nuevaSubasta = {
                SubastaID: subastaID,
                Date: date.toISOString(),
                Activo: true
            };
            const data = await (0, lite_1.addDoc)(subastasRef, nuevaSubasta);
            return {
                id: data.id,
                ...nuevaSubasta
            };
        }
        else {
            const subasta = snapshot.docs[0];
            return {
                id: subasta.id,
                ...subasta.data()
            };
        }
    }
    static async guardarOActualizarSubastaUsuario(req) {
        const { subastaID, phantomID, nombre, cantidad } = req.body;
        const date = new Date(Date.now());
        const subastasRef = (0, lite_1.collection)(firebase_1.default, "Subastantes");
        const consulta = (0, lite_1.query)(subastasRef, (0, lite_1.where)('SubastaID', '==', subastaID), (0, lite_1.where)('Activo', '==', true), (0, lite_1.where)('SubastanteID', '==', phantomID));
        const snapshot = await (0, lite_1.getDocs)(consulta);
        if (snapshot.empty) {
            const nuevaSubasta = {
                SubastaID: subastaID,
                SubastanteID: phantomID,
                Date: date.toISOString(),
                Activo: true,
                Nombre: nombre,
                Cantidad: cantidad
            };
            const data = await (0, lite_1.addDoc)(subastasRef, nuevaSubasta);
            return data.id;
        }
        else {
            const subastaDoc = snapshot.docs[0];
            const data = subastaDoc.data();
            const subastaRef = (0, lite_1.doc)(firebase_1.default, "Subastantes", subastaDoc.id);
            const subastaActualizada = {
                ...data,
                Date: date.toISOString(),
                Cantidad: data.Cantidad + cantidad
            };
            return await (0, lite_1.updateDoc)(subastaRef, subastaActualizada)
                .then(docRef => subastaRef.id)
                .catch(error => {
                throw new Error(error.message);
            });
        }
    }
    static async guardarGanador({ nombre, cantidad, subastaID, subastanteID }) {
        const ganadoresRef = await (0, lite_1.collection)(firebase_1.default, "Ganadores");
        const date = new Date(Date.now());
        const nuevoGanador = {
            Nombre: nombre,
            Cantidad: cantidad,
            SubastaID: subastaID,
            SubastanteID: subastanteID,
            Date: date.toISOString(),
        };
        const data = await (0, lite_1.addDoc)(ganadoresRef, nuevoGanador);
        return data.id;
    }
    static async finalizarSubasta(req) {
        const { subastaID } = req.params;
        const subastaDoc = (0, lite_1.doc)(firebase_1.default, "Subastas", subastaID);
        const subastantesRef = (0, lite_1.collection)(firebase_1.default, 'Subastantes');
        await (0, lite_1.updateDoc)(subastaDoc, { Activo: false })
            .catch(error => {
            throw new Error(error.message);
        });
        const subastadoresConsulta = (0, lite_1.query)(subastantesRef, (0, lite_1.where)('SubastaID', '==', subastaID), (0, lite_1.where)('Activo', '==', true));
        const snapshotSubastadores = await (0, lite_1.getDocs)(subastadoresConsulta);
        if (snapshotSubastadores.empty) {
            throw new Error("No hay subastadores");
        }
        else {
            let subastadores = snapshotSubastadores.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            subastadores = subastadores.sort((a, b) => b.Cantidad - a.Cantidad);
            await Promise.all(subastadores.map(async (subastador) => {
                const subastadorDoc = (0, lite_1.doc)(firebase_1.default, "Subastantes", subastador.id);
                await (0, lite_1.updateDoc)(subastadorDoc, { Activo: false })
                    .catch(error => {
                    throw new Error(error.message);
                });
            }));
            const ganador = subastadores[0];
            await this.guardarGanador({ nombre: ganador.Nombre, cantidad: ganador.Cantidad, subastaID, subastanteID: ganador.SubastanteID });
        }
    }
    static async descargarGanadores() {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Resultados');
        const subastasRef = await (0, lite_1.collection)(firebase_1.default, "Subastas");
        const ganadoresRef = await (0, lite_1.collection)(firebase_1.default, "Ganadores");
        const consultaSubastas = (0, lite_1.query)(subastasRef, (0, lite_1.where)('Activo', '==', false));
        const snapshotSubastas = await (0, lite_1.getDocs)(consultaSubastas);
        const consultaGanadores = (0, lite_1.query)(ganadoresRef);
        if (!snapshotSubastas.empty) {
            const subastas = snapshotSubastas.docs.map(subasta => ({ id: subasta.id, ...subasta.data() }));
            const snapshotGanadores = await (0, lite_1.getDocs)(consultaGanadores);
            if (!snapshotGanadores.empty) {
                const ganadores = snapshotSubastas.docs.map(ganador => {
                    const data = ganador.data();
                    const { Date, SubastaID, ...datos } = data;
                    const subasta = subastas.find(subasta => subasta.id === SubastaID);
                    return {
                        Subasta: subasta.SubastaID,
                        Fecha: this.formatDate(Date),
                        ...datos,
                    };
                });
                const columns = ganadores.map((obj) => Object.getOwnPropertyNames(obj));
                if (columns.length > 0) {
                    worksheet.addRow(columns[0]);
                }
                ganadores.forEach(row => {
                    const values = Object.values(row);
                    worksheet.addRow(values);
                });
                worksheet.views = [
                    {
                        showGridLines: true,
                        style: {
                            font: {
                                bold: true,
                                size: 11
                            },
                            fill: {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'c9daf8' }
                            }
                        }
                    }
                ];
                return worksheet;
            }
        }
    }
    static formatDate(isoDateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(isoDateString);
        return date.toLocaleDateString('es-ES', options);
    }
}
exports.default = SubastaService;
