import React, { useState } from 'react';
import xmljs from 'xml-js';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const XsdReader = ({ onXmlChange }) => {
  const [xsdTexts, setXsdTexts] = useState([]);

  const handleXsdChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileReaders = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({ content: e.target.result, name: file.name });
          reader.readAsText(file);
        });
      });

      Promise.all(fileReaders).then((fileContents) => {
        setXsdTexts(fileContents);
      });
    }
  };

  const parseXsd = () => {
    try {
      xsdTexts.forEach((file) => {
        const xsdJson = xmljs.xml2js(file.content, { compact: true });
        console.log(xsdJson);
      
        const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
        onXmlChange(xsdXml, file.name);
      });
      
    } catch (error) {
      console.error('Ошибка при анализе BPMN', error);
    }
  };

  return (
    <div>
      <h2>BPMN Reader</h2>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        Загрузить файл
        <input
          type="file"
          accept=".bpmn"
          style={{ display: 'none' }}
          onChange={handleXsdChange}
          multiple
        />
      </Button>
      <button onClick={parseXsd}>Анализировать BPMN</button>
    </div>
  );
};

export default XsdReader;
