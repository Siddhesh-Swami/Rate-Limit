import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/database/redis/redis.connections';
import { AccessKeySchema, ModelName, IAccessKey } from 'src/schema/accesskey.schema';
import { createKeyDto } from './models';
import { BadRequestError } from 'src/utils/errors.utils';

@Injectable()
export class AdminService {
    // constructor(@Inject("TOKEN_SERVICE_REDIS") private client: ClientProxy) {}

    constructor(
        @InjectModel(ModelName) private accessKeyModel: Model<IAccessKey>,
        private redisService: RedisService,
    ) {}

    getHello(): string {
        // console.log(process.env)

        return 'Hello World!';
    }

    async generateKey(data: createKeyDto): Promise<IAccessKey> {
        // check if key is already generated
        const accessKey = await this.accessKeyModel.findOne({ key: data.key });
        if (accessKey) {
            throw new BadRequestError('Access key already exists');
        }

        const date = new Date(data.expireAt);
        const isValid = !isNaN(date.getTime());
        if (!isValid) {
            throw new BadRequestError('Invalid date time');
        }

        const createResponse = await this.accessKeyModel.create({
            key: data.key,
            token: uuidV4(),
            isDisabled: data.isDisabled,
            expireAt: date,
            maxRateAllowedPerMin: data.maxRateAllowedPerMin,
        });

        // did not work - check why
        // const createResponseJSON = createResponse.toJSON();

        const createResponseJSON2 = JSON.stringify(createResponse);
        // once validated, publish it to subscribers
        await this.redisService.publish('rate-limitation', createResponseJSON2);
        return createResponse;
    }

    async getKeys(): Promise<IAccessKey[]> {
        return await this.accessKeyModel.find();
    }

    async updateKey(key: string, data: createKeyDto): Promise<IAccessKey> {

        // check if key exists or not
        const accessKey = await this.accessKeyModel.findOne({ key: data.key });
        if (!accessKey) {
            throw new BadRequestError('Access key does not exists');
        }

        
        const updateResponse=await this.accessKeyModel.findOneAndUpdate({ key }, data, { new: true });
        

        const updateResponseJSON2 = JSON.stringify(updateResponse);

        await this.redisService.publish('rate-limitation', updateResponseJSON2);
        return updateResponse;
    }   

}
