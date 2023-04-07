import { Inject, Route, Router } from '@helpers/helper.di'
import { FileUploadController } from '@controllers/controller.fileupload'
import { fileupload } from '@libs/lib.multer'
import { upload } from '@middlewares/middleware.upload'

@Route()
export class FileUploadRoute {
  private router: Router

  constructor(@Inject('FileUploadController') private controller: FileUploadController) {
    this.router = Router({ strict: true, caseSensitive: true })
  }

  main(): Router {
    this.router.post('/', upload(fileupload), this.controller.createFileUpload())

    return this.router
  }
}
