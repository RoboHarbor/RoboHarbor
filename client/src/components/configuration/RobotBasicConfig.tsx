import {FormInput} from "../form";

export interface RobotBasicConfigProps{
    bot?: any;
    setBotValue: (key: string, value: any) => void;
}

const RobotBasicConfig = ({bot, setBotValue}: RobotBasicConfigProps) => {

    return (
        <div>
            <h4>RobotModel Name</h4>
            <FormInput
                type="text"
                name="name"
                containerClass="mb-3"
                placeholder="RobotModel Name"
                defaultValue={bot.name}
                onChange={(e) => {
                    setBotValue("name", e.target.value);}
                }
                value={bot.name}
                required
            />
        </div>
    );
}

export default RobotBasicConfig;