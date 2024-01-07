import { Card, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';


type TeamMembersProps = {
    members: any[];
};

const TeamMembers = ({ members }: TeamMembersProps) => {
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
                <h4 className="header-title mt-0 mb-3">My Team Members</h4>
                <ul className="list-group mb-0 user-list">
                    {(members || []).map((member, index) => {
                        return (
                            <li className="list-group-item" key={index.toString()}>
                                <Link to="#" className="user-list-item">
                                    <div className="user avatar-sm float-start me-2">
                                        <img src={member.avatar} alt="member" className="img-fluid rounded-circle" />
                                    </div>
                                    <div className="user-desc">
                                        <h5 className="name mt-0 mb-1">{member.name}</h5>
                                        <p className="desc text-muted mb-0 font-12">{member.designation}</p>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </Card.Body>
        </Card>
    );
};

export default TeamMembers;
