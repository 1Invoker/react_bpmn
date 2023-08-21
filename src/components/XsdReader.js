import React, { useState } from 'react';
import xmljs from 'xml-js';

const XsdReader = ({ onXmlChange }) => {
  const [xsdText, setXsdText] = useState('');

  const handleXsdChange = (event) => {
    setXsdText(event.target.value);
  };

  const parseXsd = () => {
    try {
      const xsdJson = xmljs.xml2js(xsdText, { compact: true });
      console.log(xsdJson);

      const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
      onXmlChange(xsdXml);
    } catch (error) {
      console.error('Ошибка при анализе XSD', error);
    }
  };

  return (
    <div>
      <h2>XSD Reader</h2>
      <textarea
        rows="10"
        cols="50"
        value={xsdText}
        onChange={handleXsdChange}
        placeholder="Вставьте сюда содержимое XSD файла..."
      />
      <button onClick={parseXsd}>Анализировать XSD</button>
    </div>
  );
};

export default XsdReader;
