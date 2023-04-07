import { Model, InjectRepository, Repository } from '@helpers/helper.di'
import { FileUpload } from '@entities/entitie.fileupload'

@Model()
export class FileUploadModel {
  constructor(@InjectRepository(FileUpload) public model: Repository<FileUpload>) {}
}
