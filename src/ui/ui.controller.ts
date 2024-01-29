import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {UiService} from "./ui.service";
import {LoginDataDto, UserData} from "../models/auth/types";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags("ui")
@Controller('ui')
export class UiController {
    constructor(private readonly uiService: UiService) {}

    @Post("/login")
    @ApiOperation({summary: "Login"})
    login(@Body() loginData: LoginDataDto): any {
        return this.uiService.login(loginData.email, loginData.password);
    }
}
