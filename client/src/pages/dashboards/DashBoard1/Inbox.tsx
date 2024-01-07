import { Card, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// types
import { Message } from './types';

type InboxProps = {
    messages: Message[];
};

const Inbox = ({ messages }: InboxProps) => {
    return (
        <Card>
            <Card.Body>
                <Dropdown className="float-end" align="end">
                    <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
                        <i className="mdi mdi-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Action</Dropdown.Item>
                        <Dropdown.Item>Anothther Action</Dropdown.Item>
                        <Dropdown.Item>Something Else</Dropdown.Item>
                        <Dropdown.Item>Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <h4 className="header-title mb-3">Inbox</h4>

                <div className="inbox-widget">
                    {(messages || []).map((message, index) => {
                        return (
                            <div className="inbox-item" key={index.toString()}>
                                <Link to="#">
                                    <div className="inbox-item-img">
                                        <img src={message.avatar} alt="" className="rounded-circle" />
                                    </div>
                                    <h5 className="inbox-item-author mt-0 mb-1">{message.sender}</h5>
                                    <p className="inbox-item-text">{message.text}</p>
                                    <p className="inbox-item-date">{message.time}</p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </Card.Body>
        </Card>
    );
};

export default Inbox;
