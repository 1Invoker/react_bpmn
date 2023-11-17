import React from 'react';
import BpmnAnalyz from './BpmnAnalyz';

const BpmnAnalyzPage = ({ xsdXmls }) => {
  return (
    <div>
      <h2>BPMN Analyzer Page</h2>
      <BpmnAnalyz xsdXmls={xsdXmls} />
    </div>
  );
};

export default BpmnAnalyzPage;
