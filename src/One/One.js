import React, { useState } from 'react';
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