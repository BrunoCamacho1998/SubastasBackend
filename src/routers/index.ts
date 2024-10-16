import { Request, Response, Router } from "express"
import SubastaRouter from "./api/service.router"

export class Routers {
    router: Router
  
    constructor () {
      this.router = Router()
      this.init()
    }
  
    init ():void {
      this.router.use('/subasta', SubastaRouter)
      this.router.post('/info', (req:Request, res:Response) => {
        res.status(200).send('Hola The Move Calling Api')
      })
    }
  }
  
  const router = new Routers()
  export default router.router