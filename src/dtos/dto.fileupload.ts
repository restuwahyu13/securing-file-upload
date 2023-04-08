import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'

export class DTOFileUpload {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class DTOFileUploadById {
  @IsNotEmpty()
  @IsNumberString()
  id!: number
}
