import { Request, Response, NextFunction, Handler } from 'express'
import status from 'http-status'
import { Multer } from 'multer'
import fs from 'fs'
import path from 'path'
import short from 'short-uuid'
import sharp, { Sharp } from 'sharp'
import zlib from 'zlib'

import { Middleware } from '@helpers/helper.di'
import { MimeType } from '@helpers/helper.mimeType'
import { apiResponse } from '@helpers/helper.apiResponse'

@Middleware()
export class FileUploadMiddleware {
  use(multer: Multer, field: string): Handler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const fileupload: Handler = multer.single(field)

      fileupload(req, res, (err: any) => {
        try {
          if (err) {
            throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: err.message })
          } else {
            if (req.headers['content-type'] && !req.headers['content-type'].includes('multipart/form-data')) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'Content type not valid' })
            if (!req.file) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'File is required' })
            else if (req.file.size >= +process.env.FILE_SIZE_MAX) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'File to many large' })
            else if (!MimeType.whiteList(req.file.originalname) || !MimeType.whiteListBytes(req.file.buffer, req.file.originalname) || MimeType.blackList(req.file.originalname)) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'Mime type not valid' })

            const pattern: RegExp = new RegExp(`[^(${process.env.FILE_WHITELIST})].*`, 'gi')
            const dirname: string = path.resolve(process.cwd(), 'images')

            const extname: string = path.extname(req.file.originalname).replace('.', '')
            const filename: string = req.file.originalname.replace(pattern, short().generate()).concat(['jpeg', 'jpg', 'png', 'webp'].includes(extname) ? '.webp' : `.${extname}`)

            if (['jpeg', 'jpg'].includes(extname)) {
              const sws: Sharp = sharp().jpeg({ quality: 75 })
              const fws: fs.WriteStream = fs.createWriteStream(`${dirname}/${filename}`)

              req.file.filename = filename

              sws.pipe(fws)
              sws.write(req.file.buffer)
              sws.end()
            } else if (['png'].includes(extname)) {
              const sws: Sharp = sharp().png({ quality: 75, compressionLevel: zlib.constants.Z_HUFFMAN_ONLY })
              const fws: fs.WriteStream = fs.createWriteStream(`${dirname}/${filename}`)

              req.file.filename = filename

              sws.pipe(fws)
              sws.write(req.file.buffer)
              sws.end()
            } else if (['webp'].includes(extname)) {
              const sws: Sharp = sharp().webp({ quality: 75, effort: zlib.constants.Z_HUFFMAN_ONLY })
              const fws: fs.WriteStream = fs.createWriteStream(`${dirname}/${filename}`)

              req.file.filename = filename

              sws.pipe(fws)
              sws.write(req.file.buffer)
              sws.end()
            } else {
              const fws: fs.WriteStream = fs.createWriteStream(`${dirname}/${filename}`)

              req.file.filename = filename

              fws.write(req.file.buffer)
              fws.end()
            }
          }

          next()
        } catch (e: any) {
          if (e instanceof Error) return res.status(status.BAD_REQUEST).json(apiResponse({ stat_code: status.BAD_REQUEST, err_message: e.message }))
          else return res.status(e.stat_code).json(apiResponse({ stat_code: e.stat_code, err_message: e.err_message }))
        }
      })
    }
  }
}
