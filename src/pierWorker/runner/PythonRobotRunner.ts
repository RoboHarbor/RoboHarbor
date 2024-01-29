import {RobotRunner} from "../RobotRunner";

export default class PythonRobotRunner extends RobotRunner {


    async start(): Promise<void> {
        setTimeout(() => {
            if (this.isForever() && this.isEnabled()) {
                this.logger.log("Starting robot: " + this.robot.name);
            }



        }, 1);
    }

    isRunning(): boolean {
        return false;
    }

    triggerManualRun(): Promise<{
        success: boolean,
    }> {
        return Promise.resolve({
            success: false,
        });
    }

    getName(): string {
        return "PythonRobotRunner";
    }

}