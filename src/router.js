import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import BazePage from './One/BazePage';
import BpmnAnalyzPage from './components/BpmnAnalyzPage/BpmnAnalyzPage';
import BpmnList from './components/BpmnList/BpmnList';
import XsdComponent from './components/Xsd/XsdComponent';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<BazePage />} />
      <Route path="/bpmn-analyz-page" element={<BpmnAnalyzPage />} />
      <Route path="/bpmn-list" element={<BpmnList />} />
      <Route path="/xsd" element={<XsdComponent />} />
    </ReactRoutes>
  );
};

export default Routes;
