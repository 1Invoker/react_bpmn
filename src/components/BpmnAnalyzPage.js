import React, { useState } from 'react';
import BpmnDiagram from './BpmnDiagram';
import XsdReader from './XsdReader';

const BpmnAnalyzPage = () => {
  const [xmlData, setXmlData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleXmlChange = (xml, name) => {
    setXmlData(xml);
    setFileName(name);
  };

  return (
    <div>
      <XsdReader onXmlChange={handleXmlChange} />

      {xmlData && (
        <div>
          <h3>Анализ BPMN файла: {fileName}</h3>
          <BpmnDiagram xml={xmlData} />
        </div>
      )}
    </div>
  );
};

export default BpmnAnalyzPage;
