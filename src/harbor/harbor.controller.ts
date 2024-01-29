import {Body, Controller, Get, HttpException, Logger, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {HarborService} from "./harbor.service";
import {RoboHarborError} from "../errors/RoboHarborError";

@ApiTags("harbor")
@Controller('harbor')
export class HarborController {

    private readonly logger = new Logger(HarborController.name);

    constructor(readonly harborService: HarborService) {
    }

    @Get("/availableRunnerPackages")
    @ApiOperation({summary: "get available runner packages"})
    async getAvailableRunnerPackages(): Promise<any> {
        return await this.harborService.getAvailableRunnerPackages();
    }


}
