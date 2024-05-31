import React, { useEffect } from 'react';
import XsdReader from '../components/XsdReader/XsdReader';
import BpmnDiagram from '../components/BpmnDiagram/BpmnDiagram';
import BpmnAnalyz from '../components/BpmnAnalyz/BpmnAnalyz';
import './BazePage.css';
import useBpmnData from '../hooks/useBpmnData';
import useFilesFromStore from '../hooks/useFilesFromStore';
import useXmlSelection from '../hooks/useXmlSelection';
import BpmnDataLocked from '../Indicator/BpmnDataLocked';
import { useDispatch } from 'react-redux';
import { setXsdXmls } from '../Redux/fileSlice';

const BazePage = ({ router }) => {
  const dispatch = useDispatch();
  const xmlArray = useFilesFromStore();
  const { bpmnData, bpmnAdministrative, bpmnMezved, bpmnMezvedCatalog } =
    useBpmnData();
  const {
    xsdXmls,
    selectedXml,
    showBpmnAnalyz,
    handleXmlChange,
    handleSelectXml,
    handleFileSelect,
    handleConverterClick,
  } = useXmlSelection();

  useEffect(() => {
    dispatch(setXsdXmls(xsdXmls));
  }, []);
  console.log(xsdXmls);
  return (
    <router>
      <div className="One">
        <div className="container">
          <div className="column">
            <XsdReader
              onXmlChange={handleXmlChange}
              bpmnAdministrative={bpmnAdministrative}
            />
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
        </div>
      </div>
    </router>
  );
};

export default BazePage;
