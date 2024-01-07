import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// components
import { FormInput } from '../../components/form';

const Contact = () => {
    // form validation schema
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required('Please enter name'),
            email: yup.string().required('Please enter email').email('please enter valid email'),
            subject: yup.string().required('Please enter subject'),
            comments: yup.string().required('Please enter comments'),
        })
    );

    // form methods
    const methods = useForm({ defaultValues: {}, resolver: schemaResolver });
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    // handle form submission
    const onSubmitEvent = () => {};

    return (
        <section className="section" id="contact">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <div className="title text-center mb-5">
                            <h6 className="text-primary small-title">Contact</h6>
                            <h3>Have any Questions ?</h3>
                            <p className="text-muted">At solmen va esser far uniform grammatica.</p>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg={4}>
                        <div className="get-in-touch">
                            <h5>Get in touch</h5>
                            <p className="text-muted mb-5">At solmen va esser necessi far</p>

                            <div className="mb-3">
                                <div className="get-touch-icon float-start me-3">
                                    <h2>
                                        <i className="pe-7s-mail text-primary"></i>
                                    </h2>
                                </div>
                                <div className="overflow-hidden">
                                    <h5 className="font-16 mb-0">E-mail</h5>
                                    <p className="text-muted">example@abc.com</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="get-touch-icon float-start me-3">
                                    <h2>
                                        <i className="pe-7s-phone text-primary"></i>
                                    </h2>
                                </div>
                                <div className="overflow-hidden">
                                    <h5 className="font-16 mb-0">Phone</h5>
                                    <p className="text-muted">012-345-6789</p>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="get-touch-icon float-start me-3">
                                    <h2>
                                        {' '}
                                        <i className="pe-7s-map-marker text-primary"></i>
                                    </h2>
                                </div>
                                <div className="overflow-hidden">
                                    <h5 className="font-16 mb-0">Address</h5>
                                    <p className="text-muted">20 Rollins Road Cotesfield, NE 68829</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div className="custom-form bg-white">
                            <form onSubmit={handleSubmit(onSubmitEvent)}>
                                <Row>
                                    <Col lg={6}>
                                        <FormInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter your name..."
                                            type="text"
                                            containerClass={'mb-3'}
                                            register={register}
                                            key="name"
                                            errors={errors}
                                            control={control}
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        <FormInput
                                            label="Email address"
                                            name="email"
                                            placeholder="Enter your email..."
                                            type="email"
                                            containerClass={'mb-3'}
                                            register={register}
                                            key="email"
                                            errors={errors}
                                            control={control}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12}>
                                        <FormInput
                                            label="Subject"
                                            name="subject"
                                            placeholder="Enter subject..."
                                            type="text"
                                            containerClass={'mb-3'}
                                            register={register}
                                            key="subject"
                                            errors={errors}
                                            control={control}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12}>
                                        <FormInput
                                            label="Message"
                                            name="comments"
                                            placeholder="Enter your message..."
                                            type="textarea"
                                            containerClass={'mb-3'}
                                            rows={4}
                                            register={register}
                                            key="comments"
                                            errors={errors}
                                            control={control}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12} className="text-end">
                                        <FormInput
                                            name="send"
                                            type="submit"
                                            className="submitBnt btn btn-custom"
                                            containerClass="d-inline-block"
                                            register={register}
                                            key="send"
                                            errors={errors}
                                            control={control}
                                        />
                                    </Col>
                                </Row>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Contact;
