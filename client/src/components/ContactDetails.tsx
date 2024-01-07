import { Button, Card, Dropdown } from 'react-bootstrap';

// types
import { Contact } from '../../../src/models/Contacts/List/types';

type ContactDetailsProps = {
    contact: Contact;
};

const ContactDetails = ({ contact }: ContactDetailsProps) => {
    return (
        <Card>
            <Card.Body className="text-center">
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
                <div>
                    <img
                        src={contact.avatar}
                        alt="profileImage"
                        className="rounded-circle avatar-xl img-thumbnail mb-2"
                    />
                    <p className="text-muted font-13 mb-3">{contact.shortDesc}</p>
                    <div className="text-start">
                        <p className="text-muted font-13">
                            <strong>Full Name :</strong> <span className="ms-2">{contact.name}</span>
                        </p>

                        <p className="text-muted font-13">
                            <strong>Mobile :</strong>
                            <span className="ms-2">{contact.mobile}</span>
                        </p>

                        <p className="text-muted font-13">
                            <strong>Email :</strong> <span className="ms-2">{contact.email}</span>
                        </p>

                        <p className="text-muted font-13">
                            <strong>Location :</strong> <span className="ms-2">{contact.location}</span>
                        </p>
                    </div>
                    <Button className="rounded-pill waves-effect waves-light">Send Message</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ContactDetails;
