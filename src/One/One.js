import React, { useState, useEffect } from 'react';
import XsdReader from '../components/XsdReader';
import BpmnDiagram from '../components/BpmnDiagram/BpmnDiagram';
import BpmnAnalyz from '../components/BpmnAnalyz/BpmnAnalyz';
import './One.css';
import Button from '@mui/material/Button';
import BpmnDataAnalyzer from '../Analyz/BpmnDataAnalyzer';
import { useSelector } from 'react-redux';
// import BpmnList from '../BpmnList/BpmnList';

const One = ({ router }) => {
  const files = useSelector(state => state.file.files);
  console.log('Содержимое store:', files);

  const [xsdXmls, setXsdXmls] = useState([]);
  const [selectedXml, setSelectedXml] = useState('');
  const [showBpmnAnalyz, setShowBpmnAnalyz] = useState(true);
  const [bpmnData, setBpmnData] = useState('');

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || '') + '/api/bpmnData')
      .then(response => response.text())
      .then(data => {
        setBpmnData(data);
        console.log('Данные из /api/bpmnData:', data);
      })
      .catch(error =>
        console.error('Ошибка при получении данных BPMN:', error),
      );
  }, []);

  const handleXmlChange = (xml, fileName) => {
    setXsdXmls(prevXmls => [...prevXmls, { xml, fileName }]);
  };

  const handleSelectXml = xml => {
    setSelectedXml(xml);
  };

  const handleFileSelect = xml => {
    setSelectedXml(xml);
    setShowBpmnAnalyz(true);
  };

  const handleConverterClick = () => {
    setShowBpmnAnalyz(prevShow => !prevShow);
  };

  return (
    <router>
      <div className="One">
        <Button
          variant="contained"
          color="primary"
          onClick={handleConverterClick}
        >
          BPMN Analyzer
        </Button>
        <div className="container">
          <div className="column">
            <XsdReader onXmlChange={handleXmlChange} bpmnData={bpmnData} />
            <h3>Выбранные файлы:</h3>
            <div className="file-list-container">
              <ul className="file-list">
                {xsdXmls.map(({ xml, fileName }, index) => (
                  <li key={index}>
                    <button onClick={() => handleSelectXml(xml)}>
                      {fileName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column">
            {showBpmnAnalyz && (
              <BpmnAnalyz
                xsdXmls={xsdXmls}
                onFileSelect={handleFileSelect}
                bpmnData={bpmnData}
              />
            )}
            {selectedXml && !showBpmnAnalyz && (
              <BpmnDiagram xml={selectedXml} />
            )}
          </div>
          <div className="locked">
            <BpmnDataAnalyzer bpmnData={bpmnData} />
            {/* <BpmnList/>      */}
          </div>
        </div>
      </div>
    </router>
  );
};

export default One;
