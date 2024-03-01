import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    setSelectedItem(path);
    navigate(path);
  };

  return (
    <div className="home-container">
      <h1>Добро пожаловать в приложение</h1>
      <h2>Выберите пункт меню:</h2>
      <HomeList onItemClick={handleItemClick} />
      {selectedItem && (
        <div>
          <h2>Вы выбрали: {selectedItem}</h2>
        </div>
      )}
    </div>
  );
};

const HomeList = ({ onItemClick }) => {
  const homeItems = ['/', '/one', '/bpmn-analyz-page'];

  return (
    <ul className="home-list">
      {homeItems.map((item, index) => (
        <li key={index} className="home-list-item" onClick={() => onItemClick(item)}>
          <Button className="rounded-button" variant="contained" color="primary">
            {item}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default Home;
