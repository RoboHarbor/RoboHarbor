import classNames from 'classnames';
import { Card } from 'react-bootstrap';

type StatisticsWidget3Props = {
    variant: string;
    avatar: string;
    name: string;
    emailId: string;
    position: string;
};

const StatisticsWidget3 = ({ variant, avatar, name, emailId, position }: StatisticsWidget3Props) => {
    return (
        <Card>
            <Card.Body className="widget-user">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 avatar-lg me-3">
                        <img src={avatar} className="img-fluid rounded-circle" alt="user" />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                        <h5 className="mt-0 mb-1">{name}</h5>
                        <p className="text-muted mb-2 font-13 text-truncate">{emailId}</p>
                        <small className={classNames('text-' + variant)}>
                            <b>{position}</b>
                        </small>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StatisticsWidget3;
