import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RedisService } from 'src/database/redis/redis.connections';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessKeyModelSchema } from 'src/schema/accesskey.schema';
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    // imports:[ClientsModule.register([
    //   {
    //     name: 'TOKEN_SERVICE_REDIS',
    //     transport: Transport.TCP,
    //     options: {
    //       host: "localhost",
    //       port: 6379
    //     },
    //   },
    // ])],

    imports: [
        // schema registration
        MongooseModule.forFeature([{ name: AccessKeyModelSchema.modelName, schema: AccessKeyModelSchema.schema }]),
    ],
    controllers: [AdminController],
    providers: [AdminService, RedisService],
})
export class AdminModule {}
