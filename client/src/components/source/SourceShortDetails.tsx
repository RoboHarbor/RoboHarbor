import {IRobot, ISourceInfo} from "../../../../src/models/robot/types";
import {Button} from "react-bootstrap";
import {reloadSourceRobot, updateSourceRobot} from "../../helpers/api/robots";

const SourceShortDetails = ({ robot }: { robot: IRobot }) => {
    return (
        <div>
            {robot.source?.branch} @ {robot.source?.url}
            {robot.sourceInfo?.localVersion}
            {robot.sourceInfo?.sourceVersion}
            {robot.sourceInfo?.sourceMessage}
            <Button variant="primary" size="sm" className="float-end" onClick={() => reloadSourceRobot(robot.id)}>
                <i className={"fa fa-circle"} />
            </Button>
            {robot.sourceInfo?.sourceVersion !== robot.sourceInfo?.localVersion && (
                <Button variant="warning" size="sm" className="float-end" onClick={() => updateSourceRobot(robot.id)}>
                    <i className={"fa fa-arrow-circle-down"} />
                </Button>)}
        </div>
    );
}

export default SourceShortDetails;