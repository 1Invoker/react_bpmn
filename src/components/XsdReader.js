import React, { useState, useEffect } from 'react';
import xmljs from 'xml-js';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const XsdReader = ({ onXmlChange, bpmnData }) => {
  const [xsdTexts, setXsdTexts] = useState([]);
  console.log('bpmnData переданный:', bpmnData)

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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({ content: ev.target.result, name: file.name });
        reader.readAsText(file);
      });
    });

    Promise.all(fileReaders).then((fileContents) => {
      setXsdTexts(fileContents);
    });
  };

  const parseXsd = () => {
  try {
    xsdTexts.forEach((file) => {
      const xsdJson = xmljs.xml2js(file.content, { compact: true });
      console.log(xsdJson);
    
      const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
      onXmlChange(xsdXml, file.name);
      console.log(xsdXml);
    });
    
    if (bpmnData) {
      const bpmnJson = JSON.parse(bpmnData);
      console.log(bpmnJson[0].xml);

      // const bpmnXml = xmljs.js2xml(bpmnJson, { compact: true });
      // onXmlChange(bpmnXml, 'bpmnData');

      console.log('!!!!!!!!!!!!!!!!',bpmnData);
      onXmlChange(bpmnData, 'bpmnData');
      // // Преобразование JSON в XML
      // const bpmnXml = xmljs.js2xml(bpmnJson, { compact: true });
      
      // // Обработка данных BPMN XML
      // onXmlChange(bpmnXml, 'bpmnData.xml');
      // console.log('bpmnXml:', bpmnXml);
    }
    
    
  } catch (error) {
    console.error('Ошибка при анализе BPMN', error);
  }
};


  //  useEffect, чтобы вызывать анализ при изменении bpmnData
  useEffect(() => {
    if (bpmnData) {
      parseXsd();
    }
  }, [bpmnData]);

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

      <div
        style={{ border: '2px dashed #ccc', padding: '20px', marginTop: '20px' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        Перетащите файлы сюда или выберите их
      </div>

      <button onClick={parseXsd}>Анализировать BPMN</button>
    </div>
  );
};

export default XsdReader;