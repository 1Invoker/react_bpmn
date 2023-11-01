import React, { useState } from 'react';
import XsdReader from './components/XsdReader';
import BpmnDiagram from './components/BpmnDiagram';
import './App.css';
import Button from '@mui/material/Button';

const App = () => {
  const [xsdXml, setXsdXml] = useState('');

  return (
    <div className="App">
       <Button variant="contained" color="primary">
       XSD to BPMN Converter
      </Button>
      <div className="container">
        <div className="column">
          <XsdReader onXmlChange={setXsdXml} />
        </div>
        <div className="column">
          <BpmnDiagram xml={xsdXml} />
        </div>
      </div>
    </div>
  );
};

export default App;
