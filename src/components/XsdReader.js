import React, { useState, useEffect } from 'react';
import xmljs from 'xml-js';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch } from 'react-redux';
import { addFile, selectFile } from '../Redux/fileSlice';
import { useSelector } from 'react-redux';

const XsdReader = ({ onXmlChange, bpmnData }) => {
  const [xsdTexts, setXsdTexts] = useState([]);
  console.log('bpmnData переданный:', bpmnData);
  const dispatch = useDispatch();

  const handleXsdChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileReaders = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) =>
            resolve({ content: e.target.result, name: file.name });
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
        reader.onload = (ev) =>
          resolve({ content: ev.target.result, name: file.name });
        reader.readAsText(file);
      });
    });

    Promise.all(fileReaders).then((fileContents) => {
      setXsdTexts(fileContents);
    });
  };

  const parseXsd = () => {
    try {
      if (xsdTexts.length > 0) {
        xsdTexts.forEach((file) => {
          const xsdJson = xmljs.xml2js(file.content, { compact: true });
          const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
          onXmlChange(xsdXml, file.name);

          dispatch(addFile({ fileName: file.name, xml: xsdXml }));
          dispatch(selectFile({ fileName: file.name, xml: xsdXml }));
        });
      }

      if (bpmnData) {
        const bpmnJson = JSON.parse(bpmnData);
        bpmnJson.forEach((item) => {
          onXmlChange(item.xml, item.name);
          dispatch(addFile({ fileName: item.name, xml: item.xml }));
          dispatch(selectFile({ fileName: item.name, xml: item.xml }));
          // localStorage.setItem(item.name, JSON.stringify(item.xml));
        });
      }
    } catch (error) {
      console.error('Ошибка при анализе файлов', error);
    }
  };
  // содержимое в store redux
  const files = useSelector((state) => state.file.files);
  console.log('Содержимое store:', files);

  //содержимое в LocalStorage
  const hasDataInLocalStorage = localStorage.getItem("root") !== null;

  if (hasDataInLocalStorage) {
    console.log('В Local Storage есть данные');
  } else {
    console.log('В Local Storage нет данных');
  }

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
