import React from 'react';
import BpmnDiagram from './BpmnDiagtam';

const BpmnAnalyzPage = ({ xsdXmls }) => {
  return (
    <div>
      <h2>BPMN Analyzer Page</h2>
      <BpmnDiagram xsdXmls={xsdXmls} />
    </div>
  );
};

export default BpmnAnalyzPage;
