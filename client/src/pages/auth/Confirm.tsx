import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// components
import AuthLayout from './AuthLayout';

// images
import mail_confirm from '../../assets/images/mail_confirm.png';

const Confirm = () => {
    const { t } = useTranslation();

    return (
        <AuthLayout>
            <div className="text-center">
                <div className="mb-4">
                    <h4 className="text-uppercase mt-0">{t('Confirm Email')}</h4>
                </div>
                <img src={mail_confirm} alt="img" width="86" className="mx-auto d-block" />

                <p className="text-muted font-14 mt-2">
                    {t('A email has been send to ')}
                    <span className="fw-medium">{t('youremail@domain.com')}</span>
                    {t(
                        '. Please check for an email from company and click on the included link to reset your password.'
                    )}
                </p>
                <Link className="btn d-block btn-pink waves-effect waves-light mt-3" to="/auth/login">
                    {t('Back to Home')}
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Confirm;
