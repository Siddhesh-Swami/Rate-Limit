import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { RateService } from './rate.service';
import { fetchTokenDto } from './models';

@Controller('')
export class RateController {
    constructor(private readonly rateService: RateService) {}

    @Get("/token")
    async fetchToken(@Headers('access-key') accesskey: string) {
        console.log(accesskey, "accesskey");
        return await this.rateService.fetchToken2(accesskey);
    }

}
