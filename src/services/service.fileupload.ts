import status from 'http-status'
import { filesize } from 'filesize'
import { InsertResult } from 'typeorm'
import path from 'path'

import { Inject, Service, Repository } from '@helpers/helper.di'
import { apiResponse, ApiResponse } from '@helpers/helper.apiResponse'
import { FileUpload } from '@entities/entitie.fileupload'
import { symmetricHash } from '@helpers/helper.hash'
import { DTOFileUploadId } from '@dtos/dto.fileupload'

@Service()
export class FileUploadService {
  constructor(@Inject('FileUploadModel') private model: Repository<FileUpload>) {}

  async createFile(file: Express.Multer.File): Promise<ApiResponse> {
    try {
      const fileExt: string = path.extname(file.originalname).replace('.', '')
      const fileSum: string = symmetricHash(file.buffer, 'hex')
      const fileSize: string = filesize(file.size, { base: 2, standard: 'jedec' }).toString()
      const fileBase64Url: string = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'pdf'].includes(fileExt) ? `data:${fileExt == 'pdf' ? 'application' : 'image'}/${fileExt};base64,${file.buffer.toString('base64')}` : null

      const checkFile: FileUpload = await this.model.findOne({ select: ['original_name', 'hash'], where: [{ original_name: file.originalname }, { hash: fileSum }] })

      if (checkFile && checkFile.original_name == file.originalname) throw apiResponse({ stat_code: status.CONFLICT, err_message: 'Duplicate file upload name' })
      else if (checkFile && checkFile.hash == fileSum) throw apiResponse({ stat_code: status.CONFLICT, err_message: 'Duplicate file upload name' })

      const insertFile: InsertResult = await this.model.insert({ name: file.filename, original_name: file.originalname, hash: fileSum, url: fileBase64Url })
      if (!insertFile) throw apiResponse({ stat_code: status.CONFLICT, err_message: 'Upload file failed' })

      return apiResponse({ stat_code: status.OK, stat_message: 'Upload file success', data: { name: file.filename, size: fileSize, hash: fileSum } })
    } catch (e: any) {
      if (e instanceof Error) apiResponse({ stat_code: status.FAILED_DEPENDENCY, err_message: e.message })
      else return apiResponse({ stat_code: e.stat_code, err_message: e.err_message })
    }
  }

  async getFiles(): Promise<ApiResponse> {
    try {
      const getFiles: FileUpload[] = await this.model.find()
      return apiResponse({ stat_code: status.OK, stat_message: 'Filenames exist', data: getFiles })
    } catch (e: any) {
      if (e instanceof Error) apiResponse({ stat_code: status.FAILED_DEPENDENCY, err_message: e.message })
      else return apiResponse({ stat_code: e.stat_code, err_message: e.err_message })
    }
  }

  async getFileById(params: DTOFileUploadId): Promise<ApiResponse> {
    try {
      const checkFile: FileUpload = await this.model.findOne({ select: ['name', 'hash', 'url', 'created_at'], where: { name: `${params.filename}.webp` } })
      if (!checkFile) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Filename not exist' })

      return apiResponse({ stat_code: status.OK, stat_message: 'Filename exist', data: checkFile })
    } catch (e: any) {
      if (e instanceof Error) apiResponse({ stat_code: status.FAILED_DEPENDENCY, err_message: e.message })
      else return apiResponse({ stat_code: e.stat_code, err_message: e.err_message })
    }
  }
}
