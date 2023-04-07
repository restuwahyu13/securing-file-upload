import { Module, Injectable, Inject, Context, ObjectLiteral } from '@helpers/helper.di'
import { FileUploadService } from '@services/service.fileupload'
import { FileUploadController } from '@controllers/controller.fileupload'
import { FileUploadRoute } from '@routes/route.fileupload'
import { FileUploadModel } from '@models/model.fileupload'

@Module([
  { token: 'FileUploadService', useClass: FileUploadService },
  { token: 'FileUploadController', useClass: FileUploadController },
  { token: 'FileUploadRoute', useClass: FileUploadRoute },
  {
    token: 'FileUploadModel',
    useFactory: (): ObjectLiteral => {
      return Context.get(FileUploadModel).model
    }
  }
])
@Injectable()
export class FileUploadModule {
  constructor(@Inject('FileUploadRoute') public route: FileUploadRoute) {}
}
