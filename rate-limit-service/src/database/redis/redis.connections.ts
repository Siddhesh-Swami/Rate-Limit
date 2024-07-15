import { Injectable} from '@nestjs/common';
import { Redis } from 'ioredis';
import { GlobalService } from 'src/global.service';
import { RateLimitationDto } from 'src/limiter/rate/models';

const rateLimitChannel = 'rate-limitation';

@Injectable()
export class RedisService {
    private clients: { [key: string]: Redis } = {};

    async connect(name: string): Promise<Redis> {
        if (!this.clients[name]) {
            this.clients[name] = new Redis({
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
            });
        }
        return this.clients[name];
    }

    async getClient(name: string): Promise<Redis> {
        if (!this.clients[name]) {
            await this.connect(name);
        }
        return this.clients[name];
    }

    async publish(name: string, channelName: string, message: string) {
        const client = await this.getClient(name);
        const number = await client.publish(channelName, message);
        console.log(number);
    }

    async subscribe(name: string, channelName: string) {
        const client = await this.getClient(name);
        await client.subscribe(channelName);

        let totalSubscribers = await this.numsub('redisClient');
        console.log('total subscribers', totalSubscribers);

        client.on('message', (channel, message) => {            
            if (channel === rateLimitChannel) {
                this.handleMessage(totalSubscribers,message);
            }
        });

        console.log(GlobalService.rateLimitData);
    }

    async numsub(name: string): Promise<any> {
        const client = await this.getClient(name);
        const count = await client.call('PUBSUB', 'NUMSUB', rateLimitChannel);
        return count;
    }

    async setValue(name: string, key: string,  ttl: number,value: string,) {
        const client = await this.getClient(name);
        await client.setex(key, ttl,value);
    }

    async getValue(name: string, key: string): Promise<string> {
        const client = await this.getClient(name);
        return await client.get(key);
    }

    async exists(name: string, key: string): Promise<number> {
        const client = await this.getClient(name);
        return await client.exists(key);
    }

    handleMessage(totalSubscribers:any, message: string) {
        const rateLimitationDto = JSON.parse(message) as RateLimitationDto;

        // totalSubscribers[1] is the number of channels subscribed
        rateLimitationDto.maxRateAllowedPerMin = Math.floor(rateLimitationDto.maxRateAllowedPerMin/totalSubscribers[1]);
        
        // store the rate limit in memory of the pod
        GlobalService.rateLimitData[rateLimitationDto.key] = {
            key: rateLimitationDto.key,
            token: rateLimitationDto.token,
            isDisabled: rateLimitationDto.isDisabled,
            expireAt: rateLimitationDto.expireAt,
            maxRateAllowedPerMin: rateLimitationDto.maxRateAllowedPerMin,
        };

        GlobalService.currentRateRemaining[rateLimitationDto.key] = rateLimitationDto.maxRateAllowedPerMin;

    }
}
