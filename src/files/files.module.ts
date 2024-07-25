import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './file.model';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
