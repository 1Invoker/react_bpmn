import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Button from '@mui/material/Button';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
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
