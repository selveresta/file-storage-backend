import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from './files/files.module';
import { File } from './files/file.model';
import { parse } from 'url';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const { hostname: host, port, pathname, auth } = parse(databaseUrl);
        const [username, password] = auth.split(':');

        return {
          dialect: 'postgres',
          host,
          port: parseInt(port, 10),
          username,
          password,
          database: pathname.split('/')[1],
          autoLoadModels: true,
          synchronize: true,
          models: [File],
        };
      },
      inject: [ConfigService],
    }),
    FilesModule,
  ],
})
export class AppModule {}
