import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// types
import { PricingPlan } from './types';

type PricingProps = {
    pricingPlans: PricingPlan[];
};

const PricingCard = ({ plan }: { plan: PricingPlan }) => {
    return (
        <Col lg={4}>
            <div className="pricing-plans bg-white text-center p-4 mt-4">
                <h4 className="plan-title mt-2 mb-4">{plan.name}</h4>

                <div className="plan-price">
                    <h3 className="mb-3 price">
                        <sup>
                            <small>$</small>
                        </sup>
                        {plan.price}
                    </h3>
                    <h5 className="plan-duration text-muted font-18">Per {plan.duration}</h5>
                </div>

                <div className="pricing-content p-4 text-muted mb-2">
                    {(plan.features || []).map((feature, idx1) => {
                        return <p key={idx1}>{feature}</p>;
                    })}
                </div>

                <div className="pt-4">
                    <Link to="#" className="btn btn-custom d-block">
                        Purchase Now
                    </Link>
                </div>
            </div>
        </Col>
    );
};

const Pricing = ({ pricingPlans }: PricingProps) => {
    return (
        <section className="section bg-light" id="pricing">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <div className="title text-center mb-5">
                            <h6 className="text-primary small-title">Pricing</h6>
                            <h3>Our Pricing plans</h3>
                            <p className="text-muted">At solmen va esser far uniform grammatica.</p>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {(pricingPlans || []).map((plan, index) => {
                        return <PricingCard plan={plan} key={index.toString()} />;
                    })}
                </Row>
            </Container>
        </section>
    );
};

export default Pricing;
