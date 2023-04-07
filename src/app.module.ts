import { Container, Injectable, Module, Router } from '@helpers/helper.di'
import { FileUploadModule } from '@modules/module.fileupload'

@Module([
  {
    token: 'FileUploadModule',
    useFactory: (): Router => {
      return Container.resolve(FileUploadModule).route.main()
    }
  }
])
@Injectable()
export class AppModule {}
