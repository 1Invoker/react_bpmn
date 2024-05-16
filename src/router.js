import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import BazePage from './One/BazePage';
import BpmnAnalyzPage from './components/BpmnAnalyzPage/BpmnAnalyzPage';
import Home from './Home/Home';
import BpmnList from './components/BpmnList/BpmnList';

const Routes = () => {
  return (
    <ReactRoutes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<BazePage />} />
      <Route path="/bpmn-analyz-page" element={<BpmnAnalyzPage />} />
      <Route path="/bpmn-list" element={<BpmnList />} />
    </ReactRoutes>
  );
};

export default Routes;
