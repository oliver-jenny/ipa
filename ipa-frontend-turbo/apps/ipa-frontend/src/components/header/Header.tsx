import './header.scss';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { logout } from '@repo/switch-api/authentication';

export default function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = async (language: 'en' | 'de') => {
    await i18n.changeLanguage(language);
  };

  const onLogout = () => {
    logout();
    return navigate('/auth');
  };

  return (
    <div className="header_container">
      <div>
        <div className="language_switch">
          <a
            className="language_switch item"
            onClick={() => changeLanguage('de')}
          >
            {t('header.languages.de')}
          </a>
          |
          <a
            className="language_switch item"
            onClick={() => changeLanguage('en')}
          >
            {t('header.languages.en')}
          </a>
        </div>
        <Button className={'logout_button'} onClick={onLogout} title="logout">
          {t('header.logout')}
        </Button>
      </div>
    </div>
  );
}
