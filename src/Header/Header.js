import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Button from '@mui/material/Button';
import MySvgIcon from '../components/UI/icon/AnalyzerBpmnIcon';

const Header = () => {
  return (
    <header>
      <nav>
        <ul className="header-list">
          <li className="header-list__item">
            <div className="header-logo">
              <span className="header-logo__image">
                <MySvgIcon />
              </span>
              <span className="header-logo__text">Analyzer BPMN</span>
              <a className="header-logo__link"></a>
            </div>
          </li>
          <li className="header-list__item">
            <Link className="header-list__link" to="/bpmn-list">
              Межведомственные запросы
            </Link>
          </li>
          <li className="header-list__item">
            <Link className="header-list__link" to="/">
              Государственные услуги
            </Link>
          </li>
          <li className="header-list__item">
            <Button
              component={Link}
              to="bpmn-analyz-page"
              className="bpmn-analyz-page"
              variant="contained"
              sx={{
                color: ' #FFFFFF',
                backgroundColor: '#000000',
                fontSize: '12px',
                width: '157px',
                height: '33px',
              }}
            >
              ЗАГРУЗКА ФАЙЛА
            </Button>
          </li>
          {/* <div className="header-list__icon-container">
            <MySvgIcon />
            <span className="header-list__text">Analyzer BPMN</span>
          </div>
          <li className="header-list__mezved-list">
            <Link to="/bpmn-list">МЕЖВЕДОМСТВЕННЫЕ ЗАПРОСЫ</Link>
          </li>
          <li className="header-list__uslugi">
            <Link to="/">ГОСУДАРСТВЕННЫЕ УСЛУГИ</Link>
          </li>
          <li className="header-list__bpmn-analyz">
            <Button
              component={Link}
              to="bpmn-analyz-page"
              className="bpmn-analyz-page"
              variant="contained"
              sx={{
                color: ' #FFFFFF',
                backgroundColor: '#000000',
                fontSize: '12px',
                width: '157px',
                height: '33px',
              }}
            >
              ЗАГРУЗКА ФАЙЛА
            </Button>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
