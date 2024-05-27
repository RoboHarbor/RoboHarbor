import {
    Modal,
    Container,
} from 'react-bootstrap';
import {ISwarm} from "../../models/swarm/ISwarm";


const CreateSwarmModal = (props: {open: boolean, swarm?: ISwarm,  onClose: () => void,
    onSwarmCreated: () => void}) => {


    return (
        <Modal show={props.open}
               fullscreen={true}
               onHide={() => props.onClose()} backdrop={"static"} >
            <Modal.Header onHide={() => props.onClose()} closeButton>
                <h4 className="modal-title">Create a new Swarm</h4>
            </Modal.Header>
            <Modal.Body>
                <Container>

                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default CreateSwarmModal;
