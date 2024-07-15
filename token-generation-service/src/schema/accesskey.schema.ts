import { Schema, Document } from 'mongoose';

export const ModelName = 'AccessKey';

export const AccessKeySchema = new Schema(
    {
        key: { type: String, required: true, unique: true },
        token: { type: String, required: true, unique: true },
        isDisabled: { type: Boolean, default: false },
        expireAt: { type: Date, default: null },
        maxRateAllowedPerMin: { type: Number, default: 100 },
    },
    {
        timestamps: true,
    },
);

export interface IAccessKey extends Document {
    key: string;
    isDisabled: boolean;
    expireAt: Date;
    maxRateAllowedPerMin: number;
}

export const AccessKeyModelSchema = {
    modelName: ModelName,
    schema: AccessKeySchema,
};
