import { Body, Controller, Get, Post,Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Observable } from 'rxjs';
import { createKeyDto, updateKeyDto } from './models';
import { IAccessKey } from 'src/schema/accesskey.schema';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('/key')
    generateKey(@Body() body: createKeyDto): Promise<IAccessKey> {
        return this.adminService.generateKey(body);
    }

    @Get('/keys')
    getKeys(): Promise<IAccessKey[]> {
        return this.adminService.getKeys();
    }

    @Patch('/key')
    updateKey(@Body() body: updateKeyDto): Promise<IAccessKey> {
        return this.adminService.updateKey(body.key, body);
    }

}
