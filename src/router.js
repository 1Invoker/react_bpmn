import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import One from './One/One';
import BpmnAnalyzPage from './components/BpmnAnalyzPage/BpmnAnalyzPage';
import Home from './Home/Home';
import BpmnList from './BpmnList/BpmnList';

const Routes = () => {
  return (
    <ReactRoutes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<One />} />
      <Route path="/bpmn-analyz-page" element={<BpmnAnalyzPage />} />
      <Route path="/bpmn-list" element={<BpmnList />} />
    </ReactRoutes>
  );
};

export default Routes;
