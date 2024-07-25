import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './file.model';
import { encrypt, decrypt } from '../utils/encryption';
import { uploadToS3, downloadFromS3 } from '../utils/s3Client';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File,
  ) {
    const filesDir = path.join(__dirname, '../../files');
    fs.mkdir(filesDir, { recursive: true }).catch(console.error);
  }
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    fileSize: number,
    fileExtension: string,
    description: string,
  ) {
    try {
      const { iv, content } = encrypt(fileBuffer);

      const metadata = {
        iv, // Store the IV in the S3 metadata
      };

      const s3Response = await uploadToS3(
        Buffer.from(content, 'hex'),
        fileName,
        metadata,
      );

      if (!s3Response || !s3Response.ETag) {
        throw new Error('File upload to S3 failed');
      }

      const file = await this.fileModel.create({
        name: fileName,
        size: fileSize,
        extension: fileExtension,
        description,
      });

      return file;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async downloadFile(fileId: string): Promise<string> {
    const file = await this.fileModel.findByPk(fileId);
    if (!file) throw new NotFoundException('File not found');

    const s3File = await downloadFromS3(file.name);
    const decryptedFile = decrypt({
      iv: s3File.Metadata.iv,
      content: s3File.Body.toString('hex'),
    });

    const filePath = path.join(__dirname, '../../files', file.name);
    await fs.writeFile(filePath, decryptedFile);

    file.downloadCount += 1;
    await file.save();

    return filePath;
  }

  async listFiles(page: number, limit: number) {
    const files = await this.fileModel.findAll({
      offset: (page - 1) * limit,
      limit,
    });

    return files;
  }
}
