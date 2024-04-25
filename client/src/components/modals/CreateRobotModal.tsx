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
import toast, { Toaster } from 'react-hot-toast';
import { getRunnerPackages} from "../../helpers/api/harbor";
import {IRunnerPackage} from "../../../../src/models/harbor/types";
import ConfigurationContainer from "../configuration/ConfigurationContainer";
import {createRobotApi, runSourceValidationApi, updateRobotApi} from "../../helpers/api/robots";
import {IRobot} from "../../../../src/models/robot/types";
import {CredentialComponent} from "../authentication/CredentialComponent";
import SourceConfiguration from "../configuration/SourceConfiguration";
import RobotRunnerTypeConfiguration from "../configuration/RobotRunnerTypeConfiguration";
import RobotBasicConfig from "../configuration/RobotBasicConfig";

const robotCreationwait = () => toast.loading('Creating the Robot...', {
    icon: <i className={"mdi mdi-loading mdi-spin"}></i>
});


const CreateRobotModal = (props: {open: boolean, robot?: IRobot, onClose: () => void} = {open: false, robot: undefined, onClose:() => {}}) => {

    let [key, setKey] = useState<string|null>('bottype');
    let [bot, setBot] = useState<any>(props.robot ? props.robot : {});
    const [possibleRunners, setPossibleRunners] = useState<IRunnerPackage[]>([]); // ["docker", "shell"

    const isEdit = props.robot ? true : false;

    const setBotValue = (key: string, value: any, options?: {delete?: boolean}) => {
        if (options && options.delete) {
            setBot(_.omit(bot, key));
            return;
        }
        setBot({..._.set(bot, key, value)});
    }

    const isValue = (key: string, value: any) => {
        return _.get(bot, key) === value;
    }

    const hasValue = (key: string) => {
        return _.get(bot, key);
    }


    const finishRobot = (bot: any) => {
        const id = robotCreationwait();
        return (isEdit ? updateRobotApi(bot) : createRobotApi(bot)).then((data) => {
                toast.dismiss(id);
                if (data && data.status.toString().startsWith("2")) {
                    if (isEdit) {
                        toast.success("Robot updated.");
                    }
                    else {
                        toast.success("Robot created.");
                    }
                    props.onClose();
                }
                else {
                    toast.error("Error creating robot.", {
                        icon: <i className={"mdi mdi-alert text-danger"}></i>,
                    });
                }
            })
            .catch((err) => {
                toast.dismiss(id);
                console.log(err);
                toast.error("Error creating robot.", {
                    icon: <i className={"mdi mdi-alert text-danger"}></i>,
                });
            })
    }


    return (
                <Modal show={props.open}
                       fullscreen={true}

                       onHide={() => props.onClose()} backdrop={"static"} >
                    <Modal.Header onHide={() => props.onClose()} closeButton>
                        <h4 className="modal-title">Create a new RobotModel / App</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                        <Wizard>
                            <Steps>
                                <Tab.Container
                                    id="left-tabs-example"
                                    defaultActiveKey="bottype"
                                    activeKey={key ? key : 'bottype'}
                                >
                                    <Nav variant="tabs" as="ul"
                                         className="nav-justified bg-light form-wizard-header mb-4">
                                        <Nav.Item as="li">
                                            <Nav.Link as={Link} to="#" eventKey="bottype"
                                                        onClick={() => isEdit ? setKey("bottype") : null}
                                                      className="rounded-0 pt-2 pb-2">
                                                <i className="mdi mdi-account-circle me-1"></i>
                                                <span className="d-none d-sm-inline">Bot-Type</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li" >
                                            <Nav.Link as={Link} to="#"
                                                      onClick={() => isEdit ? setKey("source") : null}
                                                      eventKey="source" className="rounded-0 pt-2 pb-2">
                                                <i className="mdi mdi-face-profile me-1"></i>
                                                <span className="d-none d-sm-inline">Source</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li">
                                            <Nav.Link as={Link} to="#"
                                                      onClick={() => isEdit ? setKey("runner") : null}
                                                      eventKey="runner" className="rounded-0 pt-2 pb-2">
                                                <i className="mdi mdi-circle circle-outline me-1"></i>
                                                <span className="d-none d-sm-inline">Runner</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li">
                                            <Nav.Link as={Link} to="#"
                                                      onClick={() => isEdit ? setKey("settings") : null}
                                                      eventKey="settings" className="rounded-0 pt-2 pb-2">
                                                <i className="mdi mdi-cog me-1"></i>
                                                <span className="d-none d-sm-inline">Settings</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content className="pb-0 mb-0 pt-0">
                                        <Tab.Pane eventKey="bottype">
                                            <Step
                                                id="bottype"
                                                render={({ next }) => (
                                                    <Form >
                                                        <Row>
                                                            <Col sm={3}>
                                                                <div onClick={() => setBotValue("type", "forever")} className={"text-center card card-body card-hoverable "+(bot.type === "forever" ? "card-hoverable-selected" : "")}>
                                                                    <i className={"mdi mdi-36px mdi-all-inclusive"}></i>
                                                                    <h4  className="card-title">Forever Running RobotModel</h4>
                                                                    <p className="card-text">Start a robot and run forever with a watcher service.</p>
                                                                </div>
                                                            </Col>
                                                            <Col sm={3}>
                                                                <div onClick={() => setBotValue("type", "single")} className={"text-center card card-body card-hoverable "+(bot.type === "single" ? "card-hoverable-selected" : "")}>
                                                                    <i className={"mdi mdi-36px mdi-clock-start"}></i>
                                                                    <h4  className="card-title">Single Process Bot</h4>
                                                                    <p className="card-text">Start a single job when done, stop the robot. Useful for crons.</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm={24}>
                                                                <ul className="pager wizard mb-0 list-inline mt-2">
                                                                    <li className="previous list-inline-item">
                                                                    </li>
                                                                    <li className="next list-inline-item float-end">
                                                                        <Button
                                                                            onClick={() => {
                                                                                setKey("source");
                                                                            }}
                                                                            disabled={!bot.type}
                                                                            variant="secondary"
                                                                        >
                                                                            Next
                                                                        </Button>
                                                                    </li>
                                                                </ul>
                                                            </Col>
                                                        </Row>
                                                    </Form>

                                                )}
                                            />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="source">
                                            <Step
                                                id="source"
                                                render={({ next, previous }) => (
                                                    <SourceConfiguration
                                                        bot={bot}
                                                        setBotValue={setBotValue}
                                                        setPossibleRunners={setPossibleRunners}
                                                        next={() => {
                                                            setKey("runner");
                                                        }}
                                                        previous={() => {
                                                            setKey("bottype");
                                                        }}

                                                    />
                                                )}
                                            />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="runner">
                                            <Step
                                                id="runner"
                                                render={({ previous }) => (
                                                    <RobotRunnerTypeConfiguration
                                                        bot={bot}
                                                        setBotValue={setBotValue}
                                                        previous={() => {
                                                            setKey('source');
                                                        }}
                                                        next={() => {
                                                            setKey('settings');
                                                        }}
                                                        possibleRunners={possibleRunners}
                                                    />
                                                )}
                                            />
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="settings">
                                            <Step
                                                id="settings"
                                                render={({ previous }) => (
                                                    <Form>
                                                        <Col sm={12}>
                                                            <Row>

                                                                <Row>
                                                                    <Col sm={12}>
                                                                        <RobotBasicConfig setBotValue={setBotValue} bot={bot} />
                                                                        <ConfigurationContainer
                                                                            bot={bot}
                                                                            onChange={(config: any, bot: any) => {
                                                                                setBotValue("runner.config", config);
                                                                                setBot(bot);
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Row>
                                                        </Col>
                                                        <ul className="pager wizard mb-0 list-inline mt-2">
                                                            <li className="previous list-inline-item">
                                                                <Button
                                                                    onClick={() => {
                                                                        setKey('runner');
                                                                        previous();
                                                                    }}
                                                                    variant="secondary"
                                                                >
                                                                    Previous
                                                                </Button>
                                                            </li>
                                                            <li className="next list-inline-item float-end">
                                                                <Button
                                                                    onClick={() => {
                                                                        finishRobot(bot);

                                                                    }}
                                                                    variant="primary"
                                                                >
                                                                    {isEdit ? "Save" : "Create"} RobotModel
                                                                </Button>
                                                            </li>
                                                        </ul>
                                                    </Form>
                                                    )}
                                                />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Steps>
                        </Wizard>
                        </Container>
                    </Modal.Body>
                </Modal>
    );
};

export default CreateRobotModal;
