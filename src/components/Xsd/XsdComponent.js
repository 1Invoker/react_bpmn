import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import useXsdReaderStore from './useXsdReaderStore';
import { selectFiles } from '../../Redux/fileSlice';
import BpmnDiagram from '../BpmnDiagram/BpmnDiagram';

const XsdComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
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
  }, []);

  const handleFileClick = (fileName, xsdXml) => {
    setSelectedFile({ fileName, xsdXml });
  };

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
