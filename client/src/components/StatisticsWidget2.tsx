import classNames from 'classnames';
import { Badge, Card, Dropdown, ProgressBar } from 'react-bootstrap';

type StatisticsWidgetProps = {
    variant: string;
    title: string;
    trendValue: string;
    trendIcon: string;
    stats: number;
    subTitle: string;
    progress: number;
};

const StatisticsWidget2 = ({
    variant,
    title,
    trendValue,
    trendIcon,
    stats,
    subTitle,
    progress,
}: StatisticsWidgetProps) => {
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
                <h4 className="header-title mt-0 mb-3">{title}</h4>
                <div className="widget-box-2">
                    <div className="widget-detail-2 text-end">
                        <Badge bg={variant} pill className="float-start mt-3">
                            {trendValue} <i className={trendIcon}></i>
                        </Badge>
                        <h2 className="fw-normal mb-1">{stats}</h2>
                        <p className="text-muted mb-3">{subTitle}</p>
                    </div>
                    <ProgressBar
                        variant={variant}
                        now={progress}
                        className={classNames('progress-sm', 'progress-bar-alt-' + variant)}
                    ></ProgressBar>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StatisticsWidget2;
