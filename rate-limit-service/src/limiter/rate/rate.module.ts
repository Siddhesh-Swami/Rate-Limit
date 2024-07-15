import { Module } from '@nestjs/common';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { RedisService } from 'src/database/redis/redis.connections';

@Module({
    imports: [],
    controllers: [RateController],
    providers: [RateService,RedisService],
})
export class RateModule {}
