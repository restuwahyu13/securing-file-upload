import { IsNotEmpty, IsString, IsNumberString } from 'class-validator'

export class DTOFileUpload {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class DTOFileUploadId {
  @IsNotEmpty()
  @IsNumberString()
  id!: any
}
