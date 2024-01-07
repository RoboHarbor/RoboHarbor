import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// components
import { VerticalForm, FormInput } from '../../components/form';

import AuthLayout from './AuthLayout';

// images
import userImg from '../../assets/images/users/user-1.jpg';

type UserData = {
    password: string;
};

/* bottom link */
const BottomLink = () => {
    const { t } = useTranslation();
    return (
        <Row className="mt-3">
            <Col xs={12} className="text-center">
                <p className="text-muted">
                    {t('Not you? return')}{' '}
                    <Link to={'/auth/login'} className="text-dark ms-1">
                        <b>{t('Sign In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const LockScreen = () => {
    const { t } = useTranslation();

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            password: yup.string().required(t('Please enter Password')),
        })
    );

    return (
        <AuthLayout bottomLinks={<BottomLink />}>
            <div className="text-center mb-4">
                <h4 className="text-uppercase mt-0 mb-4">{t('Welcome Back')}</h4>
                <img src={userImg} alt="" width="88" className="rounded-circle img-thumbnail" />
                <p className="text-muted my-4">{t('Enter your password to access the admin.')}</p>
            </div>
            <VerticalForm<UserData> onSubmit={() => {}} resolver={schemaResolver}>
                <FormInput
                    label={t('Password')}
                    type="password"
                    name="password"
                    placeholder={t('Enter your password')}
                    containerClass={'mb-3'}
                />

                <div className="mb-0 d-grid text-center">
                    <Button variant="primary" type="submit">
                        {t('Log In')}
                    </Button>
                </div>
            </VerticalForm>
        </AuthLayout>
    );
};

export default LockScreen;
