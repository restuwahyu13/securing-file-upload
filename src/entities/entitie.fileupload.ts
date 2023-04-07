import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { IFileupload } from '@interfaces/interface.fileupload'

class DatabaseSchema {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', nullable: false })
  name!: string

  @Column({ type: 'varchar', nullable: false })
  original_name!: string

  @Column({ type: 'text', nullable: false })
  hash: string

  @Column({ type: 'longtext', nullable: true })
  url?: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date
}

@Entity()
export class FileUpload extends DatabaseSchema implements IFileupload {}
