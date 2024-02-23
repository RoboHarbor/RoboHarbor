import {IWindowProps} from "../window";
import {Button} from "react-bootstrap";
import SourceShortDetails from "../../source/SourceShortDetails";
import {deleteRobot, runRobot, stopRobot} from "../../../helpers/api/robots";
import {useState} from "react";
import CreateRobotModal from "../../modals/CreateRobotModal";

export interface IRobotControlWindowProps extends IWindowProps {

}

const RobotControlWindow = ({robot, swal, reloadRobotShort}: IRobotControlWindowProps) => {

    const [showEdit, setShowEdit] = useState<boolean>(false);

    const editRobot = () => {
        setShowEdit(true);
    }

    const run = () => {
        const robotId = window.location.pathname.split('/')[3];

        runRobot(`${robotId}`)
        reloadRobotShort();
    }

    const delReobot = () => {

        swal
            .fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28bb4b',
                cancelButtonColor: '#f34e4e',
                confirmButtonText: 'Yes, delete it!',
            })
            .then(function (result: { value: any }) {
                if (result.value) {
                    const robotId = window.location.pathname.split('/')[3];

                    deleteRobot(`${robotId}`)
                        .then(() => {
                            swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                            reloadRobotShort();
                        })


                }
            })


    }

    const stop = () => {
        const robotId = window.location.pathname.split('/')[3];

        stopRobot(`${robotId}`)
        reloadRobotShort();
    }

    return (
        <div>
            {showEdit && <CreateRobotModal open={showEdit} onClose={() => {
                setShowEdit(false);}} robot={robot} />}

            <div className="d-flex mb-3">
                <div className="flex-grow-1">
                    <h2 className="media-heading mt-0">{robot?.name}</h2>
                </div>
            </div>

            <div className="d-flex mb-3">
                <div className="flex-grow-1">
                    <Button disabled={robot.enabled} onClick={() => editRobot()} variant="secondary" className=""><i
                        className={"fa fa-edit"}/></Button>
                    {!robot.enabled ? <Button onClick={() => run()} variant="primary" className=""><i
                        className={"fa fa-play"}/></Button> : null}
                    {robot.enabled == true ? <Button onClick={() => stop()} variant="danger" className=""><i
                        className={"fa fa-stop"}/></Button> : null}
                    {!robot.enabled ?
                        <Button onClick={() => delReobot()} variant="danger" className=""><i className={"fa fa-trash"}/></Button> : null}
                </div>
            </div>

            <SourceShortDetails robot={robot}/>
        </div>
    )
}

export default RobotControlWindow;