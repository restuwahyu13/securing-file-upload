import { Inject, Route, Router } from '@helpers/helper.di'
import { FileUploadController } from '@controllers/controller.fileupload'
import { fileupload } from '@libs/lib.multer'
import { upload } from '@middlewares/middleware.upload'
import { validator } from '@middlewares/middleware.validator'
import { DTOFileUploadId } from '@dtos/dto.fileupload'

@Route()
export class FileUploadRoute {
  private router: Router

  constructor(@Inject('FileUploadController') private controller: FileUploadController) {
    this.router = Router({ strict: true, caseSensitive: true })
  }

  main(): Router {
    this.router.post('/', upload(fileupload, 'name'), this.controller.createFileUpload())
    this.router.get('/', this.controller.getFiles())
    this.router.get('/:filename', validator(DTOFileUploadId), this.controller.getFileById())

    return this.router
  }
}
