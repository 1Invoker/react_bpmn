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
          <div className="icon-container">
            <MySvgIcon />
            <span className="text">Analyzer BPMN</span>
          </div>
          <li className="one">
            <Link to="/bpmn-list">МЕЖВЕДОМСТВЕННЫЕ ЗАПРОСЫ</Link>
          </li>
          <li className="bpmn-list">
            <Link to="/">ГОСУДАРСТВЕННЫЕ УСЛУГИ</Link>
          </li>
          <li>
            <Button
              component={Link}
              to="bpmn-analyz-page"
              className="bpmn-analyz-page"
              variant="contained"
              sx={{
                color: ' #FFFFFF',
                backgroundColor: '#000000',
                borderRadius: 0,
              }}
            >
              ЗАГРУЗКА ФАЙЛА
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
