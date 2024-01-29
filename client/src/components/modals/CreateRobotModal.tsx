import {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
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
import {FormInput} from "../form";
import {useForm} from "react-hook-form";
import classNames from "classnames";
import toast, { Toaster } from 'react-hot-toast';
import { getRunnerPackages} from "../../helpers/api/harbor";
import {IRunnerPackage} from "../../../../src/models/harbor/types";
import ConfigurationContainer from "../configuration/ConfigurationContainer";
import {createRobotApi, runSourceValidationApi, updateRobotApi} from "../../helpers/api/robots";
import {IRobot} from "../../../../src/models/robot/types";

const robotCreationwait = () => toast.loading('Creating the Robot...', {
    icon: <i className={"mdi mdi-loading mdi-spin"}></i>
});
const notify = () => toast.loading('Start source validation...', {
    icon: <i className={"mdi mdi-loading mdi-spin"}></i>
});
const errorSource = (error: any) => toast.error(<div>Source validation failed.<br/><div className={"p-2 hot-toast-error"}>{error.message} (Error #{error.errorKey})</div></div>, {
    icon: <i className={"mdi mdi-alert text-danger"}></i>,

});
const successSource = () => toast.success('Source validation successful.', {
    icon: <i className={"mdi mdi-check"}></i>
});


type CustomToggleProps = {
    children: React.ReactNode;
    eventKey: string;
    containerClass: string;
    linkClass: string;
    callback?: any;
};

const CustomToggle = ({ children, eventKey, containerClass, linkClass, callback }: CustomToggleProps) => {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, () => callback && callback(eventKey));

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <h5 className={containerClass}>
            <Link
                to="#"
                className={classNames(linkClass, {
                    collapsed: !isCurrentEventKey,
                })}
                onClick={decoratedOnClick}
            >
                {children}
            </Link>
        </h5>
    );
};

const CreateRobotModal = (props: {open: boolean, robot?: IRobot, onClose: () => void} = {open: false, robot: undefined, onClose:() => {}}) => {

    let [key, setKey] = useState<string|null>('bottype');
    let [bot, setBot] = useState<any>(props.robot ? props.robot : {});

    const isEdit = props.robot ? true : false;

    const setBotValue = (key: string, value: any) => {
        setBot({..._.set(bot, key, value)});
    }

    const isValue = (key: string, value: any) => {
        return _.get(bot, key) === value;
    }

    const hasValue = (key: string) => {
        return _.get(bot, key);
    }
    const [sourceValidationLoading, setSourceValidationLoading] = useState<boolean>(false);
    const [validatedSource, setValidatedSource] = useState<boolean>(isEdit ? true : false);
    const [possibleRunners, setPossibleRunners] = useState<IRunnerPackage[]>([]); // ["docker", "shell"
    const [runnerPackages, setRunnerPackages] = useState<IRunnerPackage[]>([]);

    useEffect(() => {
        getRunnerPackages()
            .then((data) => {
                setRunnerPackages(data.data);
            });
    }, [])

    const updateBotSource = (form: any) => {
        setBotValue("source", {
            ...bot.source,
            url: form.elements.url?.value,
            branch: form.elements.branch?.value,
            ssh: form.elements.sshkey?.value,
            username: form.elements.username?.value,
            password: form.elements.password?.value,
        })
    }
    const validateCustoms = () => {
        if (!isGitUrl(bot.source.url)) {
            return false;
        }
        return true;
    }

    const validateSource = (event: any) => {
        const form = event.currentTarget;
        updateBotSource(form);

        if (validateCustoms() == true && form.checkValidity() === true) {
            setValidatedSource(true);
            return;
        }
        setValidatedSource(false);
    }

    const finishRobot = (bot: any) => {
        const id = robotCreationwait();
        return (isEdit ? updateRobotApi(bot) : createRobotApi(bot)).then((data) => {
                toast.dismiss(id);
                if (data && data.status.toString().startsWith("2")) {
                    toast.success("Robot created.");
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

    const setValidationData = (data: any) => {
        if (data.possibleRunners && data.possibleRunners.length > 0) {
            setPossibleRunners(data.possibleRunners);
        }
    }

    const runSourceValidation = () => {
        const id = notify();
        setSourceValidationLoading(true);
        runSourceValidationApi(bot)
            .then((data) => {
                toast.dismiss(id);
                successSource();
                setSourceValidationLoading(false);
                setValidationData(data.data);
                setKey("runner");
            })
            .catch((err) => {
                toast.dismiss(id);
                errorSource(err);
                setSourceValidationLoading(false);
            });
    }

    const sortByPossibleRunners = (a: IRunnerPackage, b: IRunnerPackage) => {
        if (possibleRunners.find((r) => r.name === a.name)) {
            return -1;
        }
        if (possibleRunners.find((r) => r.name === b.name)) {
            return 1;
        }
        return 0;
    }

    const isGitUrl = (url: string) => {
        if (!url) return false;
        const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
        // check if url is a git url
        // needs a ".git" at the end and should contain a domain
        return regex.test(url);
    }


    return (
                <Modal show={props.open}
                       fullscreen={true}

                       onHide={() => props.onClose()} backdrop={"static"} >
                    <Modal.Header onHide={() => props.onClose()} closeButton>
                        <h4 className="modal-title">Create a new Robot / App</h4>
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
                                                                    <h4  className="card-title">Forever Running Robot</h4>
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
                                                    <Form onChange={(e) => validateSource(e)}
                                                          noValidate>
                                                        <Row>
                                                            <Col sm={12}>
                                                                <Row>
                                                                    <Col sm={3}>
                                                                        <div onClick={() => setBotValue("source.type", "git")} className={"text-center card nomargin card-body card-fill card-hoverable "+(isValue("source.type", "git") ? "card-hoverable-selected" : "")}>
                                                                            <i className={"mdi mdi-36px mdi-github"}></i>
                                                                            <h4  className="card-title">GIT Repository</h4>
                                                                            <p className="card-text">Load Data from Repository.</p>
                                                                        </div>
                                                                    </Col>
                                                                    {isValue("type", "forever") && <Col sm={3}>
                                                                        <div className={"text-center card disabled nomargin card-body card-fill card-hoverable "+(isValue("source.type", "docker") ? "card-hoverable-selected" : "")}>
                                                                            <i className={"mdi mdi-36px mdi-docker"}></i>
                                                                            <h4  className="card-title">Docker Container</h4>
                                                                            <p className="card-text">Enter a Docker Container.</p>
                                                                        </div>
                                                                    </Col>}
                                                                    <Col sm={3}>
                                                                        <div className={"text-center card disabled nomargin card-body card-fill card-hoverable "+(isValue("source.type", "shell") ? "card-hoverable-selected" : "")}>
                                                                            <i className={"mdi mdi-36px mdi-console"}></i>
                                                                            <h4  className="card-title">Shell Terminal</h4>
                                                                            <p className="card-text">Run a easy Shell.</p>
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                                {isValue("source.type", "git") && <Row>
                                                                    <Col sm={24}>
                                                                        <div className="mt-3 p-3 card card-bordered">
                                                                            <h4 className="card-title">GIT Repository Settings</h4>
                                                                            <Form.Group className="mb-3" controlId="url">
                                                                                <Form.Label>GIT URL Repository</Form.Label>
                                                                                <Form.Control
                                                                                    defaultValue={bot.source.url}
                                                                                    isValid={isGitUrl(bot.source.url)}
                                                                                    isInvalid={!isGitUrl(bot.source.url)}
                                                                                    placeholder="https://asdasd.git" required />
                                                                                <Form.Control.Feedback type="invalid">Please provide a valid Repo URL.</Form.Control.Feedback>
                                                                            </Form.Group>
                                                                            <Accordion defaultActiveKey={"0"}>
                                                                                <Card className="mb-3" key={"0"}>

                                                                                    <Card.Header>
                                                                                        <CustomToggle
                                                                                            eventKey={String("0")}
                                                                                            containerClass="m-0 position-relative"
                                                                                            linkClass="custom-accordion-title text-reset d-block"
                                                                                        >
                                                                                            <i className="mdi mdi-help-circle me-1 text-primary"></i>
                                                                                            Authentication Settings
                                                                                            <i className="mdi mdi-chevron-down accordion-arrow"></i>
                                                                                        </CustomToggle>
                                                                                    </Card.Header>
                                                                                    <Accordion.Collapse eventKey={String("0")}>
                                                                                        <Card.Body>
                                                                                            <Form.Group className="mb-3" controlId="username">
                                                                                                <Form.Label>Username</Form.Label>
                                                                                                <Form.Control  type="text" placeholder="Username"
                                                                                                                defaultValue={bot.source.username}
                                                                                                />
                                                                                                <Form.Control.Feedback type="invalid">Please provide a valid Username.</Form.Control.Feedback>
                                                                                            </Form.Group>
                                                                                            <Form.Group className="mb-3" controlId="password">
                                                                                                <Form.Label>Password</Form.Label>
                                                                                                <Form.Control min={6} type="password"
                                                                                                                defaultValue={bot.source.password}
                                                                                                              placeholder="Password" />
                                                                                                <Form.Control.Feedback type="invalid">Please provide a valid Password.</Form.Control.Feedback>
                                                                                            </Form.Group>
                                                                                            <Form.Group className={"mb-3"} controlId={"sshkey"}>
                                                                                                <Form.Label>SSH Key</Form.Label>
                                                                                                <Form.Control
                                                                                                    as={"textarea"}
                                                                                                    defaultValue={bot.source.ssh}
                                                                                                    rows={5} placeholder={"SSH Key"} />
                                                                                                <Form.Control.Feedback type="invalid">Please provide a valid SSH Key.</Form.Control.Feedback>
                                                                                            </Form.Group>
                                                                                        </Card.Body>
                                                                                    </Accordion.Collapse>

                                                                                </Card>
                                                                            </Accordion>
                                                                            <Form.Group className="mb-3" controlId="branch">
                                                                                <Form.Label>GIT Branch</Form.Label>
                                                                                <Form.Control
                                                                                    isValid={bot.source.branch && bot.source.branch.length > 2}
                                                                                    isInvalid={!bot.source.branch || bot.source.branch.length < 2}
                                                                                    defaultValue={bot.source.branch ? bot.source.branch : "master"}
                                                                                    required min={2} type="text" placeholder="master"  />
                                                                                <Form.Control.Feedback type="invalid">Please provide a valid Branch.</Form.Control.Feedback>
                                                                            </Form.Group>

                                                                        </div>
                                                                    </Col>
                                                                </Row>}
                                                            </Col>
                                                        </Row>

                                                        <ul className="pager wizard mb-0 list-inline mt-2">
                                                            <li className="previous list-inline-item">
                                                                <Button
                                                                    onClick={() => {
                                                                        setKey('bottype');
                                                                        previous();
                                                                    }}
                                                                    variant="secondary"
                                                                >
                                                                    Previous
                                                                </Button>
                                                            </li>
                                                            <li className="next list-inline-item float-end">
                                                                <Button
                                                                    disabled={!hasValue("source.type") || !validatedSource || sourceValidationLoading}
                                                                    onClick={() => {
                                                                        runSourceValidation();
                                                                    }}
                                                                    variant="secondary"
                                                                >
                                                                    {sourceValidationLoading ? <i className="mdi mdi-spin mdi-loading me-2"></i> : null} Next
                                                                </Button>
                                                            </li>
                                                        </ul>
                                                    </Form>
                                                )}
                                            />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="runner">
                                            <Step
                                                id="runner"
                                                render={({ previous }) => (
                                                    <Form>
                                                        <Row className={"bg-light"}>
                                                            <Col sm={12} className={"text-center"}>
                                                                <input className={"searchbar bg-light"} style={{maxWidth: "250px"}} type={"text"} name={"searchRunner"} placeholder={"Search runner..."} />
                                                            </Col>
                                                            <Col sm={12} className={"d-flex flex-row overflow-auto"}>
                                                                {runnerPackages.sort(sortByPossibleRunners).map((runnerPackage: IRunnerPackage) => {
                                                                    return <div onClick={() => setBotValue("runner.type", runnerPackage.name)}
                                                                                className={"card-width-220 justify-content-center text-center  card m-2 nomargin card-body card-hoverable "+(isValue("runner.type", runnerPackage.name) ? "card-hoverable-selected" : "")}>
                                                                            <div className={"align-content-center mb-3"}><img style={{maxWidth: "50px", maxHeight: "50px"}} src={runnerPackage.logo} /></div>
                                                                            <h4  className="card-title">{runnerPackage.title}</h4>
                                                                        </div>
                                                                })}
                                                            </Col>
                                                        </Row>
                                                        <ul className="pager wizard mb-0 list-inline">
                                                            <li className="previous list-inline-item">
                                                                <Button
                                                                    onClick={() => {
                                                                        setKey('source');
                                                                        previous();
                                                                    }}
                                                                    variant="secondary"
                                                                >
                                                                    Previous
                                                                </Button>
                                                            </li>
                                                            <li className="next list-inline-item float-end">
                                                                <Button onClick={() => setKey("settings")} variant="secondary">Next</Button>
                                                            </li>
                                                        </ul>
                                                    </Form>
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
                                                                        <div>
                                                                            <h4>Robot Name</h4>
                                                                            <FormInput
                                                                                type="text"
                                                                                name="name"
                                                                                containerClass="mb-3"
                                                                                placeholder="Robot Name"
                                                                                defaultValue={bot.name}
                                                                                onChange={(e) => {
                                                                                    setBotValue("name", e.target.value);}
                                                                                }
                                                                                value={bot.name}
                                                                                required
                                                                            />
                                                                        </div>
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
                                                                    Create Robot
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
