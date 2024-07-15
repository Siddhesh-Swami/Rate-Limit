import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

let redisClient: Redis;

@Injectable()
export class RedisService implements OnModuleInit {
    constructor() {}

    async connect(): Promise<Redis> {
        redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT)
        });
        

        return redisClient;
    }

    async onModuleInit() {
        await this.connect();
        this.eventHandler();
    }

    async getClient(): Promise<Redis> {
        if (!redisClient) {
            await this.connect();
        }
        return redisClient;
    }

    async publish(channelName: string, data: string): Promise<number> {
        return await redisClient.publish(channelName, data);
    }

    eventHandler() {
        redisClient.on('message', (channel, message) => {
            console.log(`channel: ${channel}, message: ${message}`);
        });

        redisClient.on('connect', () => {
            console.log('connected to redis');
        });

        redisClient.on('error', (err) => {
            console.log(`redis ${err}`);
        });

        redisClient.on('end', () => {
            console.log('disconnected from redis');
        });

        redisClient.on('reconnecting', () => {
            console.log('reconnecting to redis');
        });
    }
}
