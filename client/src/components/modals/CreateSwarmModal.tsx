import {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    Form,
    Button,
    ProgressBar,
    Tab,
    Nav,
    useAccordionButton,
    Modal,
    Container, Accordion, AccordionContext
} from 'react-bootstrap';
import { Wizard, Steps, Step } from 'react-albus';
import _ from 'lodash';
import {useForm} from "react-hook-form";
import classNames from "classnames";
import toast, { Toaster } from 'react-hot-toast';
import { getRunnerPackages} from "../../helpers/api/harbor";
import {IRunnerPackage} from "../../../../src/models/harbor/types";
import ConfigurationContainer from "../configuration/ConfigurationContainer";
import {createRobotApi, runSourceValidationApi, updateRobotApi} from "../../helpers/api/robots";
import {IRobot} from "../../../../src/models/robot/types";
import {CredentialComponent} from "../authentication/CredentialComponent";
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
