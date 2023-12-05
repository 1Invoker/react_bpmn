import React from 'react';
import { Route, Routes } from 'react-router-dom';
import XsdReader from './components/XsdReader';
import BpmnAnalyz from './components/BpmnAnalyz';
import BpmnDiagram from './components/BpmnDiagram';
import ProcessInfo from './components/ProcessInfo';

const AppRoutes = ({ xsdXmls, handleXmlChange, handleFileSelect, handleSelectXml, showBpmnAnalyz, selectedXml }) => (
  <Routes>
    <Route
      path="/"
      element={
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
            {showBpmnAnalyz && (
              <BpmnAnalyz xsdXmls={xsdXmls} onFileSelect={handleFileSelect} />
            )}
            {selectedXml && !showBpmnAnalyz && (
              <BpmnDiagram xml={selectedXml} />
            )}
          </div>
        </div>
      }
    />
    <Route
      path="/bpmn-analyz-page"
      element={
        <BpmnAnalyz xsdXmls={xsdXmls} onFileSelect={handleFileSelect} />
      }
    />
    <Route
      path="/bpmn-diagram-page"
      element={
        <BpmnDiagram xml={selectedXml} />
      }
    />
    <Route
      path="/process-info-page"
      element={
        <ProcessInfo />
      }
    />
  </Routes>
);

export default AppRoutes;
