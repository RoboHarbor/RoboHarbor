import {Module} from "@nestjs/common";
import {LogWSService} from "./logws.service";


@Module({
    controllers: [],
    imports: [],
    providers: [LogWSService],
    exports: [LogWSService]
})
export class LogModule {}
