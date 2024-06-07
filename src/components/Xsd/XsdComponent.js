import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import useXsdReaderStore from '../../hooks/useXsdReaderStore';
import { selectFiles } from '../../Redux/fileSlice';
import BpmnDiagram from '../BpmnDiagram/BpmnDiagram';

const XsdComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [arr, setArr] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // Добавляем состояние для порядка сортировки
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('all');
  const [selectedCalledElement, setSelectedCalledElement] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [smevVersions, setSmevVersions] = useState([]);
  const [filteredSmevVersions, setFilteredSmevVersions] = useState([]);
  const [showLockedOnly, setShowLockedOnly] = useState(false);

  const handleXmlChange = useCallback((xsdXml, fileName) => {
    // console.log('xsdXml:', xsdXml);
    // console.log('File name:', fileName);
  }, []);

  const files = useSelector(state => state.file.files);
  const { parseXsd, xsdTexts } = useXsdReaderStore({
    onXmlChange: handleXmlChange,
  });

  useEffect(() => {
    parseXsd(files);
    setArr(files); // Заполняем массив arr файлами
    console.log(arr);
  }, []);

  const handleFileClick = (fileName, xsdXml) => {
    setSelectedFile({ fileName, xsdXml });
  };

  useEffect(() => {
    const analyzeSmevVersions = () => {
      const versions = arr.map(xsdXml => ({
        fileName: xsdXml.fileName,
        version: extractSmevVersion(xsdXml.xml),
        processName: extractProcessName(xsdXml.xml),
        calledElement: extractCalledElement(xsdXml.xml),
        locked: xsdXml.locked,
        dateCreated: extractDateCreated(xsdXml.xml),
        dateUpdated: extractDateUpdated(xsdXml.xml),
      }));
      console.log(versions);
      versions.sort((a, b) => {
        const compareResult = a.version.localeCompare(b.version);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      });

      let filteredSmevVersions = versions;
      if (showLockedOnly) {
        filteredSmevVersions = filteredSmevVersions.filter(
          xsdXml => xsdXml.locked === true,
        );
      }

      if (selectedSmevVersion !== 'all') {
        filteredSmevVersions = filteredSmevVersions.filter(
          xsdXml => xsdXml.version === selectedSmevVersion,
        );
      }

      if (selectedCalledElement !== 'all') {
        filteredSmevVersions = filteredSmevVersions.filter(
          xsdXml => xsdXml.calledElement === selectedCalledElement,
        );
      }

      filteredSmevVersions = filteredSmevVersions.filter(xsdXml =>
        xsdXml.processName.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      setSmevVersions(versions);
      setFilteredSmevVersions(filteredSmevVersions);
    };

    const extractDateCreated = xml => {
      const matches = xml.match(/"datecreated":"([^"]+)"/);
      return matches && matches[1] ? matches[1] : '';
    };

    const extractDateUpdated = xml => {
      const matches = xml.match(/"dateupdated":"([^"]+)"/);
      return matches && matches[1] ? matches[1] : '';
    };

    const extractSmevVersion = xml => {
      const matches = xml.match(/#\{(smev\d+)\./);
      return matches && matches[1] ? matches[1] : 'smev2';
    };

    const extractProcessName = xml => {
      const matches = xml.match(/<process.*?name="(.*?)"/);
      return matches && matches[1] ? matches[1] : 'Unknown Process Name';
    };
    const extractCalledElement = xml => {
      const matches = xml.match(
        /<callActivity id="([^"]+)" name="([^"]+)" calledElement="([^"]+)"/,
      );
      return matches && matches[3] ? matches[3] : '';
    };

    if (arr.length > 0) {
      analyzeSmevVersions();
    }
  }, [
    arr,
    sortOrder,
    selectedSmevVersion,
    selectedCalledElement,
    searchTerm,
    showLockedOnly,
  ]);

  return (
    <div>
      <h1>XSD Reader Component</h1>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>XML Content</th>
          </tr>
        </thead>
        <tbody>
          {xsdTexts.map((file, index) => (
            <tr
              key={index}
              onClick={() => handleFileClick(file.fileName, file.xsdXml)}
            >
              <td>{file.fileName}</td>
              <td>
                <pre>{file.xsdXml}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedFile && (
        <BpmnDiagram
          xml={selectedFile.xsdXml}
          fileName={selectedFile.fileName}
        />
      )}
    </div>
  );
};

export default XsdComponent;
