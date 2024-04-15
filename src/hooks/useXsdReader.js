import { useState, useEffect } from 'react';
import xmljs from 'xml-js';
import { useDispatch } from 'react-redux';
import { addFile, selectFile } from '../Redux/fileSlice';

const useXsdReader = ({ onXmlChange }) => {
  const [xsdTexts, setXsdTexts] = useState([]);
  const dispatch = useDispatch();

  const parseXsd = (xsdFiles, bpmnAdministrative) => {
    try {
      if (xsdFiles.length > 0) {
        xsdFiles.forEach(file => {
          const xsdJson = xmljs.xml2js(file.content, { compact: true });
          const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
          onXmlChange(xsdXml, file.name);

          dispatch(addFile({ fileName: file.name, xml: xsdXml }));
          dispatch(selectFile({ fileName: file.name, xml: xsdXml }));
        });
      }

      if (bpmnAdministrative) {
        const bpmnJson = JSON.parse(bpmnAdministrative);
        bpmnJson.forEach(item => {
          onXmlChange(item.xml, item.name);
          dispatch(addFile({ fileName: item.name, xml: item.xml }));
          dispatch(selectFile({ fileName: item.name, xml: item.xml }));
        });
      }
    } catch (error) {
      console.error('Error parsing files', error);
    }
  };

  return { xsdTexts, setXsdTexts, parseXsd };
};

export default useXsdReader;
