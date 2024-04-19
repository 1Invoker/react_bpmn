import React, { useState, useEffect } from 'react';
import XsdReader from '../components/XsdReader';
import BpmnDiagram from '../components/BpmnDiagram/BpmnDiagram';
import BpmnAnalyz from '../components/BpmnAnalyz/BpmnAnalyz';
import './One.css';
import Button from '@mui/material/Button';
import BpmnDataLocked from '../Analyz/BpmnDataLocked';
import { useSelector } from 'react-redux';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import MySvgIcon from '../components/UI/icon/AnalyzerBpmnIcon';

const One = ({ router }) => {
  const files = useSelector(state => state.file.files);
  console.log('Содержимое store:', files);

  const [xsdXmls, setXsdXmls] = useState([]);
  const [selectedXml, setSelectedXml] = useState('');
  const [showBpmnAnalyz, setShowBpmnAnalyz] = useState(true);
  const [bpmnData, setBpmnData] = useState('');
  const [bpmnAdministrative, setbpmnAdministrative] = useState('');
  const [bpmnMezved, setbpmnMezved] = useState('');
  const [bpmnMezvedCatalog, setbpmnMezvedCatalog] = useState('');

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
  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || '') + '/api/bpmnAdministrative')
      .then(response => response.text())
      .then(data => {
        setbpmnAdministrative(data);
        console.log('Данные из /api/bpmnAdministrative:', data);
      })
      .catch(error =>
        console.error('Ошибка при получении данных BPMN:', error),
      );
  }, []);
  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || '') + '/api/bpmnMezved')
      .then(response => response.text())
      .then(data => {
        setbpmnMezved(data);
        console.log('Данные из /api/bpmnMezved:', data);
      })
      .catch(error =>
        console.error('Ошибка при получении данных BPMN:', error),
      );
  }, []);
  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || '') + '/api/bpmnMezvedCatalog')
      .then(response => response.text())
      .then(data => {
        setbpmnMezvedCatalog(data);
        console.log('Данные из /api/bpmnMezvedCatalog:', data);
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
          className="analyzer-button"
          variant="contained"
          color="primary"
          startIcon={<MySvgIcon />}
          onClick={handleConverterClick}
        >
          Analyzer BPMN
        </Button>
        <div className="container">
          <div className="column">
            <XsdReader
              onXmlChange={handleXmlChange}
              bpmnAdministrative={bpmnAdministrative}
            />
            {/* <h3>Выбранные файлы:</h3>
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
            </div> */}
          </div>
          <div className="column">
            {showBpmnAnalyz && (
              <BpmnAnalyz
                xsdXmls={xsdXmls}
                onFileSelect={handleFileSelect}
                bpmnAdministrative={bpmnAdministrative}
              />
            )}
            {selectedXml && !showBpmnAnalyz && (
              <BpmnDiagram xml={selectedXml} />
            )}
          </div>
          <div className="locked">
            {/* <BpmnDataLocked
              bpmnAdministrative={bpmnAdministrative}
              bpmnMezvedCatalog={bpmnMezvedCatalog}
            /> */}
          </div>
        </div>
      </div>
    </router>
  );
};

export default One;
