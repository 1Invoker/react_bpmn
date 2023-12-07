import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import One from './One/One';
import BpmnAnalyzPage from './components/BpmnAnalyzPage';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<One />} />
      <Route path="/bpmn-analyz-page" element={<BpmnAnalyzPage />} />
    </ReactRoutes>
  );
};

export default Routes;