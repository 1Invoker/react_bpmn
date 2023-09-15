import React from 'react';
import XsdReader from './XsdReader';
import BpmnDiagram from './BpmnDiagram';

function ParentComponent() {
  const xsdData = [
   
  ];

  return (
    <div>
      <h1>Parent Component</h1>
      <XsdReader xsdData={xsdData} />
      <BpmnDiagram xsdData={xsdData} />
    </div>
  );
}

export default ParentComponent;
