import { Request } from 'express'
import multer, { Multer } from 'multer'

import { MimeType } from '@helpers/helper.mimeType'

const fileFilter = (req: Request, file: Express.Multer.File, done: (error: Error, destination: string) => void): void => {
  if (!req.file) {
    done(new Error('File is required'), null)
  } else if (!req.header('content-type').includes('multipart/form-data')) {
    done(new Error('Content type not valid'), null)
  } else if (+req.header('content-length') >= +process.env.FILE_SIZE_MAX) {
    done(new Error('File to many large'), null)
  } else if (!MimeType.whiteList(file.originalname) || MimeType.blackList(file.originalname)) {
    done(new Error('Mime type not valid'), null)
  } else {
    done(null, file.originalname)
  }
}

export const fileupload: Multer = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: +process.env.FILE_SIZE_MAX } })
