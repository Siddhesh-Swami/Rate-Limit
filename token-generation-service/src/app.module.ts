import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessKeyModelSchema } from './schema/accesskey.schema';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AdminModule,
        // mongodb connection
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                uri: process.env.MONGO_URI,
            }),
        }),
        // schema registration
        MongooseModule.forFeature([{ name: AccessKeyModelSchema.modelName, schema: AccessKeyModelSchema.schema }]),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
