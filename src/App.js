import React, { useState } from 'react';
import XsdReader from './components/XsdReader';
import BpmnDiagram from './components/BpmnDiagram';
import './App.css';

const App = () => {
  const [xsdXml, setXsdXml] = useState('');

  return (
    <div className="App">
      <h1>XML to BPMN Converter</h1>
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
