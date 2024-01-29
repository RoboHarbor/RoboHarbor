import { Button, Card, Dropdown } from 'react-bootstrap';

// types
import { IPier } from '../../../src/models/pier/types';

type PierDetailsProps = {
    pier: IPier;
};

const PierDetails = ({ pier }: PierDetailsProps) => {
    return (
        <Card>
            <Card.Body className="text-center">
                <Dropdown className="float-end" align="end">
                    <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
                        <i className="mdi mdi-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Edit</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div>
                    <img
                        src={""}
                        alt="profileImage"
                        className="rounded-circle avatar-xl img-thumbnail mb-2"
                    />
                    <p className="text-muted font-13 mb-3">{pier.identifier}</p>

                </div>
            </Card.Body>
        </Card>
    );
};

export default PierDetails;
