import { IsNotEmpty, IsString } from 'class-validator'

export class DTOFileUpload {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class DTOFileUploadId {
  @IsNotEmpty()
  @IsString()
  filename!: any
}
