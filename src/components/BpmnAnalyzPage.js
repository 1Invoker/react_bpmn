import React from 'react';
import BpmnDiagram from './BpmnDiagram';

const BpmnAnalyzPage = ({ xmlData }) => {
  return (
    <div>
      <h2>BPMN Diagram</h2>
      <BpmnDiagram xml={xmlData} />
    </div>
  );
};

export default BpmnAnalyzPage;
