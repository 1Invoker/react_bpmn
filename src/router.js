import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import One from './One/One';
import BpmnAnalyzPage from './components/BpmnAnalyzPage';
import Home from './Home/Home';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/one" element={<One />} />
      <Route path="/bpmn-analyz-page" element={<BpmnAnalyzPage />} />
    </ReactRoutes>
  );
};

export default Routes;