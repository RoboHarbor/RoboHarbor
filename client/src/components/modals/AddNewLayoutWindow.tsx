import {IWindow} from "../../models/robot/window";

export interface IAddNewLayoutWindowProps {
    onClose: () => void;
    onAddNewWindow: (newWindow: IWindow) => void;
}

const AddNewLayoutWindow = ({onClose, onAddNewWindow}: IAddNewLayoutWindowProps) => {
    return (
        <div>s
            <h1>Add New Layout</h1>
        </div>
    )
}

export default AddNewLayoutWindow