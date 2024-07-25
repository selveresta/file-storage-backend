import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Res,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description: string,
  ) {
    const { buffer, originalname, size } = file;
    const extension = originalname.split('.').pop();
    const uploadedFile = await this.filesService.uploadFile(
      buffer,
      originalname,
      size,
      extension,
      description,
    );
    return uploadedFile;
  }

  @Get(':id/download')
  async downloadFile(@Param('id') fileId: string, @Res() res: Response) {
    const filePath = await this.filesService.downloadFile(fileId);

    const file = createReadStream(filePath);
    file.pipe(res);
  }

  @Get('list')
  async listFiles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const files = await this.filesService.listFiles(page, limit);
    return files;
  }

  @Delete('clear')
  async clearDatabase() {
    await this.filesService.clearDatabase();
    return { message: 'Database cleared' };
  }
}
