import { IsNotEmpty, IsString } from "class-validator";


export interface RateLimitationDto{
    key : string;
    token: string;
    isDisabled : boolean;
    expireAt : string;
    maxRateAllowedPerMin : number;      
}

export class fetchTokenDto{
    @IsNotEmpty()
    @IsString()
    'access-key' : string;
}