import { Request } from 'express'
import multer, { Multer } from 'multer'

const fileFilter = (req: Request, file: Express.Multer.File, done: (error: Error, destination: string) => void): void => {
  if (!req.header('content-type').includes('multipart/form-data')) {
    done(new Error('Content type not valid'), null)
  } else if (+req.header('content-length') >= +process.env.FILE_SIZE_MAX) {
    done(new Error('File to many large'), null)
  } else {
    done(null, file.originalname)
  }
}

export const fileupload: Multer = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: +process.env.FILE_SIZE_MAX } })
