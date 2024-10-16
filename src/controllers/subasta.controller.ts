import { Request, Response } from 'express'
import SubastaService from "../services/subasta.service"

export default class SubastaController {
    static async getSubastantes (req: Request, res: Response) {
        try {
            const response = await SubastaService.obtenerSubastantes(req)
            res.status(200).json({
                status: true, 
                data: response
            })
        }
        catch (error) {
            if (error instanceof Error) {
                res?.status(400).json({
                  status: false,
                  error: {
                    code: 400,
                    message: error.message
                  }
                })
              }
        }
    }

    static async agregarEvento (req: Request, res: Response) {
      try {
          const response = await SubastaService.createEvento(req)
          res.status(200).json({
              status: true, 
              data: response
          })
      }
      catch (error) {
          if (error instanceof Error) {
              res?.status(400).json({
                status: false,
                error: {
                  code: 400,
                  message: error.message
                }
              })
            }
      }
  }

  static async guardarOActualizarSubastaUsuario (req: Request, res: Response) {
    try {
        const response = await SubastaService.guardarOActualizarSubastaUsuario(req)
        res.status(200).json({
            status: true, 
            data: response
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res?.status(400).json({
              status: false,
              error: {
                code: 400,
                message: error.message
              }
            })
          }
    }
  }

  static async finalizarSubasta (req: Request, res: Response) {
    try {
        const response = await SubastaService.finalizarSubasta(req)
        res.status(200).json({
            status: true,
            data: response
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res?.status(400).json({
              status: false,
              error: {
                code: 400,
                message: error.message
              }
            })
          }
    }
  }

  static async downloadWinners (req: Request, res: Response): Promise<void> {
    try {
      const workbook = await SubastaService.descargarGanadores()

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'data.xlsx'
      )

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end()
      })
    } catch (error) {
      if (error instanceof Error) {
        console.log({ error, message: error.message })
        res?.status(400).json({
          status: false,
          error: {
            code: 400,
            message: error.message
          }
        })
      }
    }
  }
}