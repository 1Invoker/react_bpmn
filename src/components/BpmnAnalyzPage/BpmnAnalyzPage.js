import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import xmljs from 'xml-js'; // Импорт библиотеки xml-js
import BpmnDiagram from '../BpmnDiagram/BpmnDiagram';
import ButtonXsdReader from '../ButtonXsdReader';
import { selectSelectedFile, addFile, selectFile } from '../../Redux/fileSlice'; // Импорт действий addFile и selectFile

const BpmnAnalyzPage = () => {
  const dispatch = useDispatch();
  const selectedFile = useSelector(selectSelectedFile);

  const [xmlData, setXmlData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [xsdTexts, setXsdTexts] = useState([]);

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

  const handleXsdChange = event => {
    // Обработчик загрузки XSD файла
    // Этот обработчик должен быть передан в ButtonXsdReader
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileReaders = Array.from(files).map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e =>
            resolve({ content: e.target.result, name: file.name });
          reader.readAsText(file);
        });
      });

      Promise.all(fileReaders).then(fileContents => {
        setXsdTexts(fileContents);
        // Вызываем функцию анализа после загрузки файла
        parseXsd(fileContents);
      });
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = e => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fileReaders = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev =>
          resolve({ content: ev.target.result, name: file.name });
        reader.readAsText(file);
      });
    });

    Promise.all(fileReaders).then(fileContents => {
      setXsdTexts(fileContents);
    });
  };

  const parseXsd = fileContents => {
    // Функция анализа XSD файла
    try {
      if (fileContents.length > 0) {
        fileContents.forEach(file => {
          const xsdJson = xmljs.xml2js(file.content, { compact: true });
          const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
          handleXmlChange(xsdXml, file.name); // Используем переданную функцию onXmlChange

          dispatch(addFile({ fileName: file.name, xml: xsdXml }));
          dispatch(selectFile({ fileName: file.name, xml: xsdXml }));
        });
      }
    } catch (error) {
      console.error('Ошибка при анализе файлов', error);
    }
  };
  const files = useSelector(state => state.file.files);
  console.log('Содержимое store:', files);

  const keys = Object.keys(localStorage);
  // Вывести содержимое localStorage
  keys.forEach(key => {
    console.log(`${key}: ${localStorage.getItem(key)}`);
  });

  return (
    <div>
      <ButtonXsdReader
        handleXsdChange={handleXsdChange}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        parseXsd={parseXsd}
        onXmlChange={handleXmlChange} // Передаем функцию onXmlChange
      />

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
