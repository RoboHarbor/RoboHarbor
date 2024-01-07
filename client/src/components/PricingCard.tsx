import { Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// types
import { PricingPlan } from '../../../src/models/other/types';

type PricingCardProps = {
    plans: PricingPlan[];
    containerClass?: string;
};

const PricingCard = ({ plans, containerClass }: PricingCardProps) => {
    return (
        <Row className={containerClass}>
            {(plans || []).map((plan, index) => {
                return (
                    <article
                        key={index.toString()}
                        className={classNames('pricing-column', plans.length === 3 ? 'col-md-4' : 'col-xl-3 col-md-6')}
                    >
                        {plan.isPopular && (
                            <div className="ribbon">
                                <span>POPULAR</span>
                            </div>
                        )}
                        <Card>
                            <Card.Body className="inner-box">
                                <div className="plan-header p-3 text-center">
                                    <h3 className="plan-title">{plan.name}</h3>
                                    <h2 className="plan-price fw-normal">${plan.price}</h2>
                                    <div className="plan-duration">Per {plan.duration}</div>
                                </div>
                                <ul className="plan-stats list-unstyled text-center p-3 mb-0">
                                    {(plan.features || []).map((feature, idx1) => {
                                        return <li key={idx1}>{feature}</li>;
                                    })}
                                </ul>

                                <div className="text-center">
                                    <Link
                                        to="#"
                                        className="btn btn-success btn-bordered-success rounded-pill waves-effect waves-light"
                                    >
                                        Signup Now
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </article>
                );
            })}
        </Row>
    );
};

export default PricingCard;
