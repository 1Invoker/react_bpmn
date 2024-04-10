import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li className="Home">
            <Link to="/">Главная</Link>
          </li>
          <li className="one">
            <Link to="/one">Анализ всех Bpmn</Link>
          </li>
          <li className="bpmn-analyz-page">
            <Link to="/bpmn-analyz-page">Страница отдельного анализа BPMN</Link>
          </li>
          <li className="bpmn-list">
            <Link to="/bpmn-list">Список всех BPMN</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
