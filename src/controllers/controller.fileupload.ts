import { Request, Response, Handler, NextFunction } from 'express'
import { OutgoingMessage } from 'http'

import { FileUploadService } from '@services/service.fileupload'
import { Controller, Inject } from '@helpers/helper.di'
import { ApiResponse } from '@helpers/helper.apiResponse'

@Controller()
export class FileUploadController {
  constructor(@Inject('FileUploadService') private service: FileUploadService) {}

  createFileUpload(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.createFile(req.file)
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.stat_code).json(e)
      }
    }
  }

  getFiles(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.getFiles()
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.stat_code).json(e)
      }
    }
  }

  getFileById(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.getFileById(req.params as any)
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.stat_code).json(e)
      }
    }
  }
}
