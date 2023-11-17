import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import XsdReader from './components/XsdReader';
import BpmnDiagram from './components/BpmnDiagram';
import BpmnAnalyz from './components/BpmnAnalyz';
import './App.css';
import Button from '@mui/material/Button';

const App = () => {
  const [xsdXmls, setXsdXmls] = useState([]);
  const [selectedXml, setSelectedXml] = useState('');
  const [showBpmnAnalyz, setShowBpmnAnalyz] = useState(false);

  const handleXmlChange = (xml, fileName) => {
    setXsdXmls((prevXmls) => [...prevXmls, { xml, fileName }]);
  };

  const handleSelectXml = (xml) => {
    setSelectedXml(xml);
  };

  const handleConverterClick = () => {
    setShowBpmnAnalyz((prevShow) => !prevShow);
  };

  return (
    <Router>
      <div className="App">
        <Button variant="contained" color="primary" onClick={handleConverterClick}>
          BPMN Converter
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
            {selectedXml && !showBpmnAnalyz && <BpmnDiagram xml={selectedXml} />}
            {showBpmnAnalyz && <BpmnAnalyz xsdXmls={xsdXmls} />}
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
