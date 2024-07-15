import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/database/redis/redis.connections';
import { GlobalService } from 'src/global.service';
import { RateLimitationDto } from './models';
import { BadRequestError } from 'src/utils/errors.utils';

@Injectable()
export class RateService {

    constructor(private redisService: RedisService) {}
    
    async fetchToken2(accesskey: string) {

        const rateLimitationDto = GlobalService.rateLimitData[accesskey];

        if (!rateLimitationDto) {
            throw new BadRequestError('Invalid Access Key');
        }

        const rateLimitation: RateLimitationDto = rateLimitationDto;
        if (rateLimitation.isDisabled || new Date() > new Date(rateLimitation.expireAt)) {
            throw new BadRequestError('Access key is disabled/expired');
        }

        if(GlobalService.currentRateRemaining[rateLimitation.key] <= 0) {
            throw new BadRequestError('Rate limit exceeded');
        }

        // console.log(GlobalService.currentRateRemaining, "currentrate");
        GlobalService.currentRateRemaining[rateLimitation.key] -= 1;

        return {
            token: rateLimitation.token
        };


    }

}
