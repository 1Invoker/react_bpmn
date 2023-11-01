import React, { useState } from 'react';
import xmljs from 'xml-js';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const XsdReader = ({ onXmlChange }) => {
  const [xsdText, setXsdText] = useState('');

  const handleXsdChange = (event) => {
    const file = event.target.files[0]; // Получаем выбранный файл
    if (file) {
      // Читаем содержимое файла как текст
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        setXsdText(fileContent); // Обновляем состояние xsdText с содержанием файла
      };
      reader.readAsText(file);
    }
  };

  const parseXsd = () => {
    try {
      const xsdJson = xmljs.xml2js(xsdText, { compact: true });
      console.log(xsdJson);

      const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
      onXmlChange(xsdXml);
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
        />
      </Button>
      <button onClick={parseXsd}>Анализировать BPMN</button>
    </div>
  );
};

export default XsdReader;
