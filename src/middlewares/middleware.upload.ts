import { Request, Response, NextFunction, Handler } from 'express'
import status from 'http-status'
import { Multer } from 'multer'
import fs from 'fs'
import path from 'path'
import short from 'short-uuid'
import sharp, { Sharp } from 'sharp'
import zlib from 'zlib'

import { MimeType } from '@helpers/helper.mimeType'
import { apiResponse } from '@helpers/helper.apiResponse'

export const upload = (multer: Multer, field: string): Handler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const fileupload: Handler = multer.single(field)
    fileupload(req, res, (err: any) => {
      try {
        if (err) {
          throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: err.message })
        } else {
          if (req.headers['content-type'] && !req.headers['content-type'].includes('multipart/form-data')) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'Content type not valid' })
          else if (req.file && !MimeType.whiteListBytes(req.file.buffer, req.file.originalname)) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'Mime type not valid' })
          else if (req.file && req.file.size >= +process.env.FILE_SIZE_MAX) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'File to many large' })

          const dir: string = path.resolve(process.cwd(), 'images')
          const pattern: RegExp = new RegExp(`[^(${process.env.FILE_WHITELIST})].*`, 'gi')
          const extname: string = path.extname(req.file.originalname)
          const filename: string = req.file.originalname.replace(pattern, short().generate()) + '.webp'

          if (['.jpeg', '.jpg'].includes(extname)) {
            const sws: Sharp = sharp().jpeg({ quality: 75 })
            const fws: fs.WriteStream = fs.createWriteStream(`${dir}/${filename}`)

            req.file.filename = filename

            sws.pipe(fws)
            sws.write(req.file.buffer)
            sws.end()
          } else if (['.png'].includes(extname)) {
            const sws: Sharp = sharp().png({ quality: 75, compressionLevel: zlib.constants.Z_HUFFMAN_ONLY })
            const fws: fs.WriteStream = fs.createWriteStream(`${dir}/${filename}`)

            req.file.filename = filename

            sws.pipe(fws)
            sws.write(req.file.buffer)
            sws.end()
          } else if (['.webp'].includes(extname)) {
            const sws: Sharp = sharp().webp({ quality: 75, effort: zlib.constants.Z_HUFFMAN_ONLY })
            const fws: fs.WriteStream = fs.createWriteStream(`${dir}/${filename}`)

            req.file.filename = filename

            sws.pipe(fws)
            sws.write(req.file.buffer)
            sws.end()
          } else {
            const fws: fs.WriteStream = fs.createWriteStream(`${dir}/${filename}`)

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
