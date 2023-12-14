import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BpmnDiagram from './BpmnDiagram';
import XsdReader from './XsdReader';
import { selectSelectedFile, selectFile } from '../Redux/fileSlice';

const BpmnAnalyzPage = () => {
  const dispatch = useDispatch();
  const selectedFile = useSelector(selectSelectedFile);

  const [xmlData, setXmlData] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    // Обработка изменений в выбранном файле из Redux-хранилища
    if (selectedFile) {
      console.log('Selected File in BpmnAnalyzPage:', selectedFile);
      setXmlData(selectedFile.xml);
      setFileName(selectedFile.fileName);
    }
  }, [selectedFile]);

  const handleXmlChange = (xml, name) => {
    // Отправляем действие в Redux-хранилище
    console.log('Handle XML Change:', xml, name);
    dispatch(selectFile({ xml: xml, fileName: name }));
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
