import {Accordion, AccordionContext, Button, Card, Col, Form, Row, useAccordionButton} from "react-bootstrap";
import {CredentialComponent} from "../authentication/CredentialComponent";
import {useContext, useState} from "react";
import {runSourceValidationApi} from "../../helpers/api/robots";
import toast from "react-hot-toast";
import _ from "lodash";
import {Link} from "react-router-dom";
import classNames from "classnames";

const notify = () => toast.loading('Start source validation...', {
    icon: <i className={"mdi mdi-loading mdi-spin"}></i>
});
const errorSource = (error: any) => toast.error(<div>Source validation failed.<br/><div className={"p-2 hot-toast-error"}>{error.message} (Error #{error.errorKey})</div></div>, {
    icon: <i className={"mdi mdi-alert text-danger"}></i>,

});
const successSource = () => toast.success('Source validation successful.', {
    icon: <i className={"mdi mdi-check"}></i>
});


export interface SourceConfigurationProps {
    next: () => void;
    setBotValue: (key: string, value: any, options?: any) => void;
    setPossibleRunners: (runners: any) => void;
    bot: any;
    isEdit?: boolean;
    previous?: () => void;

}


type CustomToggleProps = {
    children: React.ReactNode;
    onChanged?: any;
    eventKey: string;
    containerClass: string;
    linkClass: string;
    callback?: any;
};

const CustomToggle = ({ children, eventKey, containerClass, onChanged, linkClass, callback }: CustomToggleProps) => {
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
                onClick={(c: any) => {
                    onChanged();
                    decoratedOnClick(c);
                }}
            >
                {children}
            </Link>
        </h5>
    );
};

const SourceConfiguration = ({bot, next, setBotValue, setPossibleRunners, isEdit, previous}: SourceConfigurationProps) => {

    const [sourceValidationLoading, setSourceValidationLoading] = useState<boolean>(false);
    const [validatedSource, setValidatedSource] = useState<boolean>(isEdit ? true : false);
    const [useAuthentication, setUseAuthentication] = useState<boolean>(bot && bot.source?.credentials ? true : false);

    const isValue = (key: string, value: any) => {
        return _.get(bot, key) === value;
    }

    const hasValue = (key: string) => {
        return _.get(bot, key);
    }

    const validateCustoms = () => {
        if (!isGitUrl(bot.source.url)) {
            return false;
        }
        return true;
    }

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

    const validateSource = (event: any) => {
        const form = event.currentTarget;
        updateBotSource(form);

        if (validateCustoms() == true && form.checkValidity() === true) {
            setValidatedSource(true);
            return;
        }
        setValidatedSource(false);
    }

    const setValidationData = (data: any) => {
        if (data.possibleRunners && data.possibleRunners.length > 0) {
            setPossibleRunners(data.possibleRunners);
        }
    }

    const toggleAuthentication = () => {
        if (useAuthentication) {
            setBotValue("source.credentials", null, {
                delete: true
            });
        }
        setUseAuthentication(!useAuthentication);

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
                next()
            })
            .catch((err) => {
                toast.dismiss(id);
                errorSource(err);
                setSourceValidationLoading(false);
            });
    }

    const isGitUrl = (url: string) => {
        if (!url) return false;
        const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
        // check if url is a git url
        // needs a ".git" at the end and should contain a domain
        return regex.test(url);
    }



    return <Form onChange={(e) => validateSource(e)}
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
                            {<Accordion defaultActiveKey={useAuthentication ? "0" : ""} activeKey={useAuthentication ? "0" : ""}>
                                <Card className="mb-3" key={"0"}>

                                    <Card.Header>
                                        <CustomToggle
                                            eventKey={String("0")}
                                            onChanged={() => {
                                                toggleAuthentication();
                                            }}
                                            containerClass="m-0 position-relative"
                                            linkClass="custom-accordion-title text-reset d-block"
                                        >
                                            <Form.Switch style={{float: "left"}} disabled={true} checked={useAuthentication} />
                                            <i className="mdi mdi-help-circle me-1 text-primary"></i>
                                            Authentication Settings
                                        </CustomToggle>
                                    </Card.Header>
                                    <Accordion.Collapse className={"active"} eventKey={String("0")}>
                                        <Card.Body>
                                            <CredentialComponent
                                                credentials={bot.source.credentials}
                                                credentialType={bot.source?.url ? (bot.source?.url?.includes("http") ? "http" : "ssh") : undefined}
                                                onCredentialChanged={(authenticationEntry) => {
                                                    setBotValue("source.credentials", authenticationEntry);
                                                }}
                                            />

                                        </Card.Body>
                                    </Accordion.Collapse>

                                </Card>
                            </Accordion>}
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
                        if (previous) {
                            previous();
                        }
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
    </Form>;
}

export default SourceConfiguration;