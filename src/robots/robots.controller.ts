import {Body, Controller, Delete, Get, HttpException, Logger, Param, Post, Put} from '@nestjs/common';
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

    @Get("/credentials")
    @ApiOperation({summary: "get all credentials"})
    async getAllCredentials(): Promise<any> {
        try {
            const creds = await this.robotService.getAllCredentials();

            return creds.map((cred: any) => {
                return {
                    id: cred.id,
                    name: cred.name,
                    username: cred.username,
                    type: cred.username && cred.password ? "http" : "ssh"
                }
            });
        } catch (e) {
            this.logger.error("credentials creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Post("/reloadSource/:id")
    @ApiOperation({summary: "reload source by id"})
    async reloadSource(@Param("id") id: string): Promise<any> {
        try {
            return await this.robotService.reloadSource(id);
        } catch (e) {
            this.logger.error("source reload error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Delete("/:id")
    @ApiOperation({summary: "delete robot by id"})
    async deleteRobotById(@Param("id") id: string): Promise<any> {
        try {
            return await this.robotService.deleteRobotById(id);
        } catch (e) {
            this.logger.error("robot delete error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Post("/credentials")
    @ApiOperation({summary: "create credentials"})
    async createCredentials(@Body() credentials: any): Promise<any> {
        try {
            return await this.robotService.createCredentials(credentials);
        } catch (e) {
            this.logger.error("credentials creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
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
            return await this.robotService.updateRobot(id, bot)
                .catch((e) => {
                    throw e;
                });
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

    @Post("/deleteRobot/:id")
    @ApiOperation({summary: "delete robot by id"})
    async deleteRobot(@Param("id") id: string): Promise<any> {
        try {
            return await this.robotService.deleteRobot(id);
        } catch (e) {
            this.logger.error("robot creation error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }

    @Post("/updateSource/:id")
    @ApiOperation({summary: "update source by id"})
    async updateSource(@Param("id") id: string): Promise<any> {
        try {
            return await this.robotService.updateSource(id);
        } catch (e) {
            this.logger.error("source update error: ", e);
            if (e instanceof RoboHarborError) {
                throw e.getHttpException();
            }
            throw new HttpException(e.message, e.status);
        }
    }


}
