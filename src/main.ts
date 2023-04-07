import 'reflect-metadata'
import 'express-async-errors'
import 'dotenv/config'
import express, { Express, Request, Response } from 'express'
import http, { OutgoingMessage, Server } from 'http'
import status from 'http-status'
import { Connection, createConnection, useContainer } from 'typeorm'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import zlib from 'zlib'
import hpp from 'hpp'

import { Container, Injectable, Context, Router } from '@helpers/helper.di'
import { apiResponse } from '@helpers/helper.apiResponse'
import { AppModule } from '@/app.module'

@Injectable()
class App {
  private app: Express
  private server: Server
  private env: string
  private port: number
  private pathEntitiesDir: string

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.env = process.env.NODE_ENV as any
    this.port = process.env.PORT as any
    this.pathEntitiesDir = ['development'].includes(process.env.NODE_ENV) ? 'src/entities/*.ts' : 'dist/entities/*.js'
  }

  private async connection(): Promise<Connection> {
    useContainer(Context)
    return createConnection({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      entities: [this.pathEntitiesDir],
      synchronize: ['development'].includes(process.env.NODE_ENV) ? true : false,
      logger: ['development'].includes(process.env.NODE_ENV) ? 'advanced-console' : undefined,
      logging: ['development'].includes(process.env.NODE_ENV) ? true : false,
      trace: ['development'].includes(process.env.NODE_ENV) ? true : false,
      connectTimeout: 60000
    })
  }

  private config(): void {
    this.app.disable('x-powered-by')
    this.server.maxHeadersCount = +process.env.BODY_SIZE_MAX
    this.server.headersTimeout = 300
    this.server.keepAliveTimeout = 300
    Container.resolve<AppModule>(AppModule)
  }

  private middleware(): void {
    this.app.use(bodyParser.json({ limit: +process.env.BODY_SIZE_MAX, strict: true, inflate: true }))
    this.app.use(bodyParser.raw({ limit: +process.env.BODY_SIZE_MAX, inflate: true }))
    this.app.use(bodyParser.urlencoded({ limit: +process.env.BODY_SIZE_MAX, extended: true, inflate: true }))
    this.app.use(hpp({ checkBody: true, checkQuery: true }))
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true
      })
    )
    this.app.use(
      compression({
        strategy: zlib.constants.Z_RLE,
        level: zlib.constants.Z_BEST_COMPRESSION,
        memLevel: zlib.constants.Z_BEST_COMPRESSION
      })
    )
    this.app.use(
      helmet({
        contentSecurityPolicy: true,
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: true,
        dnsPrefetchControl: true,
        expectCt: true,
        frameguard: true,
        hidePoweredBy: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        originAgentCluster: true,
        permittedCrossDomainPolicies: true,
        referrerPolicy: true,
        xssFilter: true
      })
    )
    if (['development'].includes(this.env)) {
      this.app.use(morgan('dev'))
    }
  }

  private route(): void {
    this.app.use('/fileupload', Container.resolve<Router>('FileUploadModule'))
    this.app.all('*', (_req: Request, res: Response): OutgoingMessage => res.status(status.OK).json(apiResponse({ stat_code: status.OK, stat_message: 'Ping' })))
  }

  private run(): void {
    const serverInfo: string = `Server is running on port: ${this.port}`
    this.server.listen(this.port, () => console.info(serverInfo))
  }

  public async main(): Promise<void> {
    try {
      const con: Connection = await this.connection()
      this.config()
      this.middleware()
      this.route()
      this.run()

      console.info(`database connected: ${con.isConnected}`)
    } catch (e: any) {
      console.error(`database not connected: ${JSON.stringify(e)}`)
    }
  }
}

/**
 * @description boostraping app and run app with env development / production
 */

;(function () {
  if (process.env.NODE_ENV != 'test') Container.resolve<App>(App).main()
})()
