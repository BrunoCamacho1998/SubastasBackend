import { Request } from "express";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import db from "./firebase";
const Excel = require('exceljs')

// const xlsx = require('xlsx');
// const path = require('path');

// const filePath = path.join(__dirname, '../assets', 'subastas.xlsx');

export interface Ganador {
    nombre: string;
    cantidad: number;
    subastaID: string;
    subastanteID: string;
}

export default class SubastaService {
    static async obtenerSubastantes (req: Request) {
        const { subastaID } = req.params;

        const SubaCollect = await collection(db, "Subastantes")

        const consulta = query(SubaCollect, where('Activo', '==', true), where('SubastaID', '==', subastaID))

        const snapchot = await getDocs(consulta);

        const subastantes: any[] = []

        snapchot.forEach((doc: any) => {
            subastantes.push({ id: doc.id, ...doc.data() })
        })

        return subastantes
    }

    static async createEvento (req: Request) {
        
        const { subastaID } = req.body;
        const date = new Date(Date.now())

        const subastasRef = await collection(db, "Subastas");
        const consulta = query(subastasRef, where('SubastaID', '==', subastaID), where('Activo', '==', true))

        const snapshot = await getDocs(consulta)

        if (snapshot.empty) {
            const nuevaSubasta = {
                SubastaID: subastaID,
                Date: date.toISOString(),
                Activo: true
            };
    
            const data = await addDoc(subastasRef, nuevaSubasta);

            return {
                id: data.id,
                ...nuevaSubasta
            }
        } else {
            const subasta = snapshot.docs[0];
            return {
                id: subasta.id,
                ...subasta.data()
            }
        }
    }

    static async guardarOActualizarSubastaUsuario (req: Request) {
        const { subastaID, phantomID, nombre, cantidad } = req.body;

        const date = new Date(Date.now())

        const subastasRef = collection(db, "Subastantes");
        const consulta = query(subastasRef, 
                where('SubastaID', '==', subastaID),
                where('Activo', '==', true), 
                where('SubastanteID', '==', phantomID))

        const snapshot = await getDocs(consulta)

        if (snapshot.empty) {
            const nuevaSubasta = {
                SubastaID: subastaID,
                SubastanteID: phantomID,
                Date: date.toISOString(),
                Activo: true,
                Nombre: nombre,
                Cantidad: cantidad
            };
    
            const data = await addDoc(subastasRef, nuevaSubasta);

            return data.id
        } else {
            const subastaDoc = snapshot.docs[0];
            const data = subastaDoc.data();

            const subastaRef = doc(db, "Subastantes", subastaDoc.id)
            
            const subastaActualizada = {
                ...data,
                Date: date.toISOString(),
                Cantidad: data.Cantidad + cantidad
            }

            return await updateDoc(subastaRef, subastaActualizada)
            .then(docRef => subastaRef.id)
            .catch(error => {
                throw new Error(error.message)
            })
        }
    }

    static async guardarGanador ({ nombre, cantidad, subastaID, subastanteID } : Ganador) {

        const ganadoresRef = await collection(db, "Ganadores");
        const date = new Date(Date.now())

        const nuevoGanador = {
            Nombre: nombre,
            Cantidad: cantidad,
            SubastaID: subastaID,
            SubastanteID: subastanteID,
            Date: date.toISOString(),
        }

        const data = await addDoc(ganadoresRef, nuevoGanador);
        return data.id
    }

    static async finalizarSubasta (req: Request) {
    
        const { subastaID } = req.params;

        const subastaDoc = doc(db, "Subastas", subastaID)
        const subastantesRef = collection(db,'Subastantes');
        
        await updateDoc(subastaDoc, { Activo: false })
        .catch(error => {
            throw new Error(error.message)
        });

        const subastadoresConsulta = query(subastantesRef, where('SubastaID', '==', subastaID), where('Activo', '==', true))
        const snapshotSubastadores = await getDocs(subastadoresConsulta)

        if (snapshotSubastadores.empty) {
            throw new Error("No hay subastadores")
        } else {
            let subastadores: any[] = snapshotSubastadores.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            subastadores = subastadores.sort((a,b) => b.Cantidad - a.Cantidad)

           await Promise.all( subastadores.map(async (subastador) => {
                const subastadorDoc = doc(db, "Subastantes", subastador.id)
                await updateDoc(subastadorDoc, { Activo: false })
                .catch(error => {
                    throw new Error(error.message)
                })
            }))
    
            const ganador = subastadores[0]
            await this.guardarGanador({ nombre: ganador.Nombre, cantidad: ganador.Cantidad, subastaID, subastanteID: ganador.SubastanteID })
            
        }
    }

    static async descargarGanadores() {
        const workbook = new Excel.Workbook()
        const worksheet = workbook.addWorksheet('Resultados')

        const subastasRef = await collection(db, "Subastas");
        const ganadoresRef = await collection(db, "Ganadores");

        const consultaSubastas = query(subastasRef, where('Activo', '==', false))
        const snapshotSubastas = await getDocs(consultaSubastas)

        
        const consultaGanadores = query(ganadoresRef)

        if (!snapshotSubastas.empty) {
            const subastas: any[] = snapshotSubastas.docs.map(subasta => ({ id: subasta.id, ...subasta.data() }))

            const snapshotGanadores = await getDocs(consultaGanadores)

            if (!snapshotGanadores.empty) {
                const ganadores: any[] = snapshotSubastas.docs.map(ganador => {
                    const data = ganador.data()

                    const { Date, SubastaID, ...datos } = data

                    const subasta = subastas.find(subasta => subasta.id === SubastaID)
                    return {
                        Subasta: subasta.SubastaID,
                        Fecha: this.formatDate(Date),
                        ...datos,

                    }
                })

                const columns = ganadores.map((obj: any) => Object.getOwnPropertyNames(obj))

                if (columns.length > 0) {
                    worksheet.addRow(columns[0])
                }

                ganadores.forEach(row => {
                    const values = Object.values(row)
                    worksheet.addRow(values)
                })

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
                ]

                return worksheet
            }
        }
    }

    static formatDate(isoDateString: string) {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(isoDateString);
        return date.toLocaleDateString('es-ES', options);
    }
    
}