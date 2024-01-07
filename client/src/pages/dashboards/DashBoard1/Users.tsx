import { Col, Row } from 'react-bootstrap';

// component
import StatisticsWidget3 from '../../../components/StatisticsWidget3';

// images
import avatar1 from '../../../assets/images/users/user-3.jpg';
import avatar2 from '../../../assets/images/users/user-2.jpg';
import avatar3 from '../../../assets/images/users/user-1.jpg';
import avatar4 from '../../../assets/images/users/user-10.jpg';

const Users = () => {
    return (
        <Row>
            <Col xl={3} md={6}>
                <StatisticsWidget3
                    variant="warning"
                    avatar={avatar1}
                    name="Chadengle"
                    emailId="coderthemes@gmail.com"
                    position="Admin"
                />
            </Col>
            <Col xl={3} md={6}>
                <StatisticsWidget3
                    variant="secondary"
                    avatar={avatar2}
                    name="Michael Zenaty"
                    emailId="coderthemes@gmail.com"
                    position="Support Lead"
                />
            </Col>
            <Col xl={3} md={6}>
                <StatisticsWidget3
                    variant="success"
                    avatar={avatar3}
                    name="Stillnotdavid"
                    emailId="coderthemes@gmail.com"
                    position="Designer"
                />
            </Col>
            <Col xl={3} md={6}>
                <StatisticsWidget3
                    variant="info"
                    avatar={avatar4}
                    name="Tomaslau"
                    emailId="coderthemes@gmail.com"
                    position="Developer"
                />
            </Col>
        </Row>
    );
};

export default Users;
