import cors from 'cors'
import express, { Application } from 'express'
import path from 'path'
import apiRouter from './routers'

export default class Server {
  app: Application

  constructor () {
    this.app = express()
    this.app.use('/assets', express.static(path.join(__dirname, '../src/assets')))
    this.app.listen(process.env.PORT, () => console.log(`App listen in port ${process.env.PORT} and host ${process.env.DB_HOST}`))
  }

  middlewares (): void {
    this.app.use(cors({
        origin: '*',
        methods: '*',
        allowedHeaders: 'Content-Type',
      }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }

  endpoints (): void {
    this.app.use('/api', apiRouter)
  }
}
