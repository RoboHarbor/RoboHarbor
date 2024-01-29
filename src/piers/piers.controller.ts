import {Controller, Get} from '@nestjs/common';
import {PiersService} from "./piers.service";

@Controller('piers')
export class PiersController {

    constructor(private readonly piersService: PiersService) {

    }

    @Get()
    async getAllPiers() {
        return await this.piersService.getAll();
    }

}
