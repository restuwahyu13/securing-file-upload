import { Request, Response, NextFunction, Handler } from 'express'
import status from 'http-status'
import fs from 'fs'
import path from 'path'
import short from 'short-uuid'
import { Multer } from 'multer'

import { MimeType } from '@helpers/helper.mimeType'
import { apiResponse } from '@helpers/helper.apiResponse'

export const upload = (multer: Multer): Handler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const fileupload: Handler = multer.single('name')
    fileupload(req, res, (err: any) => {
      try {
        if (err) {
          throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: err.message })
        } else {
          if (!MimeType.whiteListBytes(req.file.buffer, req.file.originalname)) throw apiResponse({ stat_code: status.BAD_REQUEST, err_message: 'Mime type not valid' })
          const dir: string = path.resolve(process.cwd(), 'images')
          const pattern: RegExp = new RegExp(`[^(${process.env.FILE_WHITELIST})]`, 'gi')
          const filename: string = req.file.originalname.replace(pattern, short().generate() + '.')
          const fws: fs.WriteStream = fs.createWriteStream(`${dir}/${filename}`)

          req.file.filename = filename
          fws.write(req.file.buffer)
          fws.end()
        }

        next()
      } catch (e: any) {
        if (e instanceof Error) return res.status(status.BAD_REQUEST).json(apiResponse({ stat_code: status.BAD_REQUEST, err_message: e.message }))
        else return res.status(e.stat_code).json(apiResponse({ stat_code: e.stat_code, err_message: e.err_message }))
      }
    })
  }
}
