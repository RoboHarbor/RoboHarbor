import { Col, Container, Row } from 'react-bootstrap';
import classNames from 'classnames';
import CountUp from 'react-countup';

// types
import { Statistic } from './types';

type StatisticsProps = {
    statistics: Statistic[];
};

const Statistics = ({ statistics }: StatisticsProps) => {
    return (
        <section className="section bg-gradient">
            <Container fluid>
                <Row>
                    {(statistics || []).map((item, index) => {
                        return (
                            <Col key={index.toString()} lg={3} sm={6}>
                                <div className="text-center p-3">
                                    <div className="counter-icon text-white-50 mb-4">
                                        <i className={classNames(item.icon, 'display-4')}></i>
                                    </div>
                                    <div className="counter-content">
                                        <h2 className="counter_value mb-3 text-white">
                                            <CountUp duration={3} start={0} end={item.value} {...item.counterOptions} />
                                        </h2>
                                        <h5 className="counter-name text-white">{item.title}</h5>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
};

export default Statistics;
