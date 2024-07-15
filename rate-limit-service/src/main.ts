import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RedisService } from './database/redis/redis.connections';
import { AllExceptionsFilter } from './utils/exception.filter';
import { GlobalService } from './global.service';


async function bootstrap() {
  /*
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  );

  await app.listen();
  */

    const app = await NestFactory.create(AppModule);

    const redisService = new RedisService();
    redisService.connect('redisClient');

    // create new redis instance for subscriber
    redisService.connect('subscriberClient');
    redisService.subscribe('subscriberClient','rate-limitation');

    setInterval(async () => {
      
      Object.keys(GlobalService.rateLimitData).forEach(async (key) => {
        GlobalService.currentRateRemaining[key] = GlobalService.rateLimitData[key].maxRateAllowedPerMin;
        console.log(GlobalService.currentRateRemaining);
      });

    }, parseInt(process.env.RATE_INTERVAL));


    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(3001);
}
bootstrap();
