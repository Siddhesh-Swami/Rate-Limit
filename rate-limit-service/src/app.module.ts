import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RateModule } from './limiter/rate/rate.module';
import { RedisService } from './database/redis/redis.connections';

@Module({
    imports: [ConfigModule.forRoot(),RateModule],
    controllers: [],
    providers: [RedisService],
})
export class AppModule {}
