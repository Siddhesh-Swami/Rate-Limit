import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class createKeyDto {
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    expireAt: string;

    @IsNotEmpty()
    @IsNumber()
    maxRateAllowedPerMin: number;

    @IsNotEmpty()
    @IsBoolean()
    isDisabled: boolean;
}

export class fetchKeysDto {
    key: string;
}


export class updateKeyDto {

    @IsNotEmpty()
    @IsString()
    key: string;

    @IsBoolean()
    @IsOptional()
    isDisabled: boolean;

    @IsNumber()
    @IsOptional()
    maxRateAllowedPerMin: number;

    @IsString()
    @IsOptional()
    expireAt: string;
}
