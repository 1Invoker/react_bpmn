import React, { useState } from 'react';
import XsdReader from './components/XsdReader';
import BpmnDiagram from './components/BpmnDiagram';
import './App.css';
import Button from '@mui/material/Button';
import StageInfo from './components/StageInfo';
import FieldsExtractor from './components/FieldsExtractor';
import BpmnFileReader from './components/BpmnFileReader';

const App = () => {
  const [xsdXml, setXsdXml] = useState('');

  return (
    <div className="App">
       <Button variant="contained" color="primary">
       BPMN Converter
      </Button>
      {/* <FieldsExtractor/> */}
      {/* <BpmnFileReader /> */}
      <div className="container">
        <div className="column">
          <XsdReader onXmlChange={setXsdXml} />
        </div>
        <StageInfo />
        <div className="column">
          <BpmnDiagram xml={xsdXml} />
        </div>
      </div>
    </div>
  );
};

export default App;
