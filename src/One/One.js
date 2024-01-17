import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import XsdReader from '../components/XsdReader';
import BpmnDiagram from '../components/BpmnDiagram';
import BpmnAnalyz from '../components/BpmnAnalyz';
import './One.css';
import Button from '@mui/material/Button';

const One = ({ router }) => {
  const [xsdXmls, setXsdXmls] = useState([]);
  const [selectedXml, setSelectedXml] = useState('');
  const [showBpmnAnalyz, setShowBpmnAnalyz] = useState(true);
  const [bpmnData, setBpmnData] = useState('');
  const [actReProcdefData, setActReProcdefData] = useState(''); // Новый state для данных от /api/actReProcdefData
  const [actGeBytearrayData, setActGeBytearrayData] = useState(''); // Новый state для данных от /api/actGeBytearrayData


  useEffect(() => {
    // GET-запрос к /api/bpmnData
    fetch((process.env.REACT_APP_API_URL || "") + '/api/bpmnData')
      .then(response => response.text())
      .then(data => {
        setBpmnData(data);
        console.log('Данные из /api/bpmnData:', data); // Вывод в консоль
      })
      .catch(error => console.error('Ошибка при получении данных BPMN:', error));

    // GET-запрос к /api/actReProcdefData
    fetch((process.env.REACT_APP_API_URL || "") + '/api/actReProcdefData')
      .then(response => response.text())
      .then(data => {
        setActReProcdefData(data);
        console.log('Данные из /api/actReProcdefData:', data); // Вывод в консоль
      })
      .catch(error => console.error('Ошибка при получении данных actReProcdefData:', error));

  //   // GET-запрос к /api/actGeBytearrayData
    fetch((process.env.REACT_APP_API_URL || "") + '/api/actGeBytearrayData')
      .then(response => response.text())
      .then(data => {
        setActGeBytearrayData(data);
        console.log('Данные из /api/actGeBytearrayData:', data); // Вывод в консоль
      })
      .catch(error => console.error('Ошибка при получении данных actGeBytearrayData:', error));
  }, []); 
  

  const handleXmlChange = (xml, fileName) => {
    setXsdXmls((prevXmls) => [...prevXmls, { xml, fileName }]);
  };

  const handleSelectXml = (xml) => {
    setSelectedXml(xml);
  };

  const handleFileSelect = (xml) => {
    setSelectedXml(xml);
    setShowBpmnAnalyz(true);
  };

  const handleConverterClick = () => {
    setShowBpmnAnalyz((prevShow) => !prevShow);
  };

  return (
    <router>
      <div className="One">
        <Button variant="contained" color="primary" onClick={handleConverterClick}>
          BPMN Analyzer
        </Button>
        <div className="container">
          <div className="column">
            <XsdReader onXmlChange={handleXmlChange} />
            <h3>Выбранные файлы:</h3>
            <ul>
              {xsdXmls.map(({ xml, fileName }, index) => (
                <li key={index}>
                  <button onClick={() => handleSelectXml(xml)}>{fileName}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="column">
            {showBpmnAnalyz && <BpmnAnalyz xsdXmls={xsdXmls} onFileSelect={handleFileSelect} />}
            {selectedXml && !showBpmnAnalyz && <BpmnDiagram xml={selectedXml} />}
          </div>
        </div>
      </div>
    </router>
  );
};

export default One;