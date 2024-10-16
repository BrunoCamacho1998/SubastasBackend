import { Router } from "express"
import SubastaController from "../../controllers/subasta.controller"

export class SubastaRouter {
    router: Router
    constructor () {
      this.router = Router()
      this.init()
    }
  
    private init () {
      this.router.get('/obtenerSubastantes/:subastaID', SubastaController.getSubastantes)
      this.router.post('/crearEvento', SubastaController.agregarEvento)
      this.router.post('/guardarActualizarSubastaUsuario', SubastaController.guardarOActualizarSubastaUsuario)
      this.router.post('/finalizarSubasta/:subastaID', SubastaController.finalizarSubasta)
    this.router.post('/descargarGanadores', SubastaController.downloadWinners)
    }
}
  const privateRoute = new SubastaRouter()
  export default privateRoute.router