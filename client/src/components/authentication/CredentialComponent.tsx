import React, {useEffect} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {ICredentialsInfo} from "../../../../src/models/robot/types";
import {createCredentials, getCredentials} from "../../helpers/api/robots";
import _ from "lodash";
import toast from "react-hot-toast";

export interface ICredentialsProps {
    credentials: ICredentialsInfo | null;
    onCredentialChanged: (authenticationEntry: ICredentialsInfo | null) => void;
    credentialType?: string;
}

export const CredentialComponent = (props: ICredentialsProps) => {
    const [showCreateAuthentication, setShowCreateAuthentication] = React.useState<boolean>(false);
    const [options, setOptions] = React.useState<ICredentialsInfo[]>([]);
    const [creationLoading, setCreationLoading] = React.useState<boolean>(false);
    const [initialCredentials, setInitialCredentials] = React.useState<ICredentialsInfo | null>(null);
    const [credentials, setCredentials] = React.useState<ICredentialsInfo | null>(props.credentials);

    const fetchAuthenticationEntries = async () => {
        const data = await getCredentials();
        setOptions(data);
        if (data.length <= 0) {
            setShowCreateAuthentication(true);
        }
    }

    useEffect(() => {


        fetchAuthenticationEntries();


    }, []);

    const showCreation = () => {
        setShowCreateAuthentication(true);
        setCredentials(null);
        props.onCredentialChanged(null);
    }

    const hideCreation = () => {
        setShowCreateAuthentication(false);
        props.onCredentialChanged(initialCredentials);
    }

    const onChanged = (key: string, value: string) => {
        let newCredentials = Object.assign({}, credentials);
        if (!newCredentials) {
            newCredentials = {} as ICredentialsInfo;
        }
        newCredentials = _.set(newCredentials, key, value);
        setCredentials(newCredentials);
    }

    const createAuthentication = () => {
        setCreationLoading(true);
        createCredentials(credentials as ICredentialsInfo).then((data) => {
            props.onCredentialChanged(data);
            setCreationLoading(false);
            fetchAuthenticationEntries();
            setCredentials(null);
            setShowCreateAuthentication(false);
        })
        .catch((err) => {
            toast.error(err.message);
            setCreationLoading(false);
            fetchAuthenticationEntries();
        });

    }

    const isValid = () => {
        if (!credentials) {
            return false;
        }
        if (!credentials.name || credentials.name === "") {
            return false;
        }
        if (!credentials.mode || credentials.mode === "") {
            return false;
        }
        if (credentials.mode === "userpassword") {
            if (!credentials.username || credentials.username === "") {
                return false;
            }
            if (!credentials.password || credentials.password === "") {
                return false;
            }
        }
        if (credentials.mode === "ssh") {
            if (!credentials.sshKey || credentials.sshKey === "") {
                return false;
            }
        }

        return true;
    }

    const filterType = (option: any) => {
        if (props.credentialType) {
            return option.type?.toLowerCase() === props.credentialType?.toLowerCase();
        }
        return true;
    }

    const getType = (option: any) => {
        if (option.type) {
            return "(" + option.type + ")";
        }
        return null;
    }

    return (
        <div>
            {!showCreateAuthentication && <Form.Group className="mb-3" controlId="authenticationType">
                <Form.Label>Select your Authentication</Form.Label>
                <Form.Control as="select" value={props.credentials?.id}
                                onChange={(e) => {
                                    const selected = options.find((option) => option.id && option.id === parseInt(e.target.value));
                                    if (selected) {
                                        props.onCredentialChanged(selected);
                                    }


                                }}
                              disabled={options.length === 0}
                                >
                    {options && options.filter(filterType).map((option) => {
                        return (
                            <option key={option.id} value={option.id}>{option.name} {getType(option)} {option.username ? option.username : null}</option>
                        )
                    })}
                </Form.Control>


            </Form.Group>}
            {!showCreateAuthentication && <Row>
                <Col md={12}>
                    <Button onClick={() => showCreation()} variant={"outline-primary"}>
                        Create New Authentication
                    </Button>
                </Col>
            </Row>}
            {showCreateAuthentication && <Row >
                <Col md={12} className={"d-flex justify-content-end pb-3"}>
                    <Button onClick={() => hideCreation()} variant={"outline-primary"}>
                        Cancel
                    </Button>
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name"
                                      isValid={credentials?.name !== undefined && credentials?.name !== null && credentials?.name !== ""}
                                      onChange={(e) => onChanged("name", e.target.value)}
                                      defaultValue={credentials?.name}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="type">
                        <Form.Label>Username and Password</Form.Label>
                        <Form.Check type="radio" id={"mode"}
                                    onChange={(e) => {
                                        onChanged("mode", "userpassword");
                                        }
                                    }
                                    checked={credentials?.mode ? credentials?.mode == "userpassword" : false}  />
                    </Form.Group>
                    <Form.Group style={{opacity: credentials?.mode !== "userpassword" ? 0.3 : 1}} className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control  type="text" placeholder="Username"
                                       disabled={credentials?.mode !== "userpassword"}
                                        onChange={(e) => onChanged("username", e.target.value)}
                                       defaultValue={credentials?.username}
                        />
                        <Form.Control.Feedback type="invalid">Please provide a valid Username.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{opacity: credentials?.mode !== "userpassword" ? 0.3 : 1}}  className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control  min={1} type="password"
                                      disabled={credentials?.mode !== "userpassword"}
                                      defaultValue={credentials?.password}
                                        onChange={(e) => onChanged("password", e.target.value)}
                                      placeholder="Password" />
                        <Form.Control.Feedback type="invalid">Please provide a valid Password.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="type">
                        <Form.Label>SSH Key</Form.Label>
                        <Form.Check type="radio"  id={"mode"}
                                    onChange={(e) => {
                                        onChanged("mode", "ssh");
                                        }
                                    }
                                    checked={credentials?.mode ? credentials?.mode == "ssh" : false} />
                    </Form.Group>
                    <Form.Group style={{opacity: credentials?.mode !== "ssh" ? 0.3 : 1}}  className={"mb-3"} controlId={"sshkey"}>
                        <Form.Label>SSH Key</Form.Label>
                        <Form.Control
                            disabled={credentials?.mode !== "ssh"}
                            as={"textarea"}
                            onChange={(e) => onChanged("sshKey", e.target.value)}
                            defaultValue={credentials?.sshKey}
                            rows={5} placeholder={"SSH Key"} />
                        <Form.Control.Feedback type="invalid">Please provide a valid SSH Key.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={12} className={"d-flex justify-content-end pb-3"}>
                    <Button onClick={() => createAuthentication()}
                            disabled={!isValid()}

                            variant={"primary"}>
                        {creationLoading && <span className="spinner-border spinner-border-sm mr-2" role="status"
                                                  aria-hidden="true"/>}
                        Create Authentication
                    </Button>
                </Col>
            </Row>}

        </div>
    )
}