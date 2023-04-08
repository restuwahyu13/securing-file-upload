import { Inject, Route, Router } from '@helpers/helper.di'
import { FileUploadController } from '@controllers/controller.fileupload'
import { FileUploadMiddleware } from '@middlewares/middleware.upload'
import { ValidatorMiddleware } from '@middlewares/middleware.validator'
import { fileupload as multer } from '@libs/lib.multer'
import { DTOFileUploadById } from '@dtos/dto.fileupload'

@Route()
export class FileUploadRoute {
  private router: Router

  constructor(
    @Inject('FileUploadController') private controller: FileUploadController,
    @Inject('ValidatorMiddleware') private validator: ValidatorMiddleware,
    @Inject('FileUploadMiddleware') private fileupload: FileUploadMiddleware
  ) {
    this.router = Router({ strict: true, caseSensitive: true })
  }

  main(): Router {
    this.router.post('/', this.fileupload.use(multer, 'name'), this.controller.createFileUpload())
    this.router.get('/', this.controller.getFiles())
    this.router.get('/:id', this.validator.use(DTOFileUploadById), this.controller.getFileById())

    return this.router
  }
}
