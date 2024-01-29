import {Body, Controller, Get, HttpException, Logger, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {RoboHarborError} from "../errors/RoboHarborError";
import {HarborService} from "../harbor/harbor.service";
import {RobotsService} from "./robots.service";

@Controller('robots')
@ApiTags("robots")
export class RobotsController {

    private readonly logger = new Logger(RobotsController.name);

    constructor(readonly robotService: RobotsService) {
    }

    @Get("/")
    @ApiOperation({summary: "get all robots"})
    async getAllRobots(): Promise<any> {
        try {
            return await this.robotService.getAllRobots();
        } catch (e) {
            this.logger.error("robot creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }


    @Post("/createRobot")
    @ApiOperation({summary: "create robot"})
    async createRobot(@Body() bot: any): Promise<any> {
        try {
            return await this.robotService.createRobot(bot);
        } catch (e) {
            this.logger.error("robot creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Post("/validateRobot")
    @ApiOperation({summary: "validate robot"})
    async validateRobot(@Body() bot: any): Promise<any> {
        try {
            return await this.robotService.validateRobot(bot);
        } catch (e) {
            this.logger.error("robot validation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Put("/:id")
    @ApiOperation({summary: "update robot"})
    async updateRobot(@Param("id") id: string, @Body() bot: any): Promise<any> {
        try {
            return await this.robotService.updateRobot(id, bot);
        } catch (e) {
            this.logger.error("robot update error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }
    @Get("/:id")
    @ApiOperation({summary: "get robot by id"})
    async getRobot(@Param("id") id: string): Promise<any> {
        try {
            return await this.robotService.getRobot(id);
        } catch (e) {
            this.logger.error("robot creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Post("/runRobot/:id")
    @ApiOperation({summary: "run robot by id"})
    async runRobot(@Param("id") id: string): Promise<any> {
        try {
            return await this.robotService.runRobot(id);
        } catch (e) {
            this.logger.error("robot creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Post("/stopRobot/:id")
    @ApiOperation({summary: "stop robot by id"})
    async stopRobot(@Param("id") id: string): Promise<any> {
        try {
            return await this.robotService.stopRobot(id);
        } catch (e) {
            this.logger.error("robot creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

}
