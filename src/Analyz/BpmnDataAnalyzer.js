import React from 'react';
import './BpmnDataAnalyzer.css';

const Indicator = ({ locked }) => {
  const indicatorClassName = locked ? 'indicator green' : 'indicator red';

  return <div className={indicatorClassName}></div>;
};

const DataItem = ({ id, name, locked }) => (
  <div className="data-item">
    <div>XML ID: {id}</div>
    <div>Name: {name}</div>
    <div>Locked: {locked ? 'true' : 'false'}</div>
  </div>
);

const BpmnDataAnalyzer = ({ bpmnData }) => {
  let parsedData = [];

  try {
    parsedData = JSON.parse(bpmnData);
  } catch (error) {
    console.error('Ошибка при парсинге BPMN данных:', error);
  }

  if (!parsedData || !Array.isArray(parsedData)) {
    return <div>No BPMN data available</div>;
  }

  return (
    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {parsedData.map((data, index) => (
        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <DataItem id={data.id} name={data.name} locked={data.locked} />
          <Indicator locked={data.locked} />
        </div>
      ))}
    </div>
  );
};

export default BpmnDataAnalyzer;
