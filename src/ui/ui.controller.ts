import {Controller, Get, Post} from '@nestjs/common';
import {UiService} from "./ui.service";
import {UserData} from "../models/auth/types";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags("ui")
@Controller('ui')
export class UiController {
    constructor(private readonly uiService: UiService) {}

    @Post("/login")
    @ApiOperation({summary: "Login"})
    login(): any {
        return this.uiService.login();
    }
}
