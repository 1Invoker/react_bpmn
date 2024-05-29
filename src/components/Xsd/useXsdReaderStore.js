import { useState, useCallback } from 'react';
import xmljs from 'xml-js';
import { useDispatch } from 'react-redux';
import { addFile, selectFile } from '../../Redux/fileSlice';

const useXsdReaderStore = ({ onXmlChange }) => {
  const [xsdTexts, setXsdTexts] = useState([]);
  const dispatch = useDispatch();

  const parseXsd = useCallback(
    async files => {
      try {
        if (files) {
          const results = [];

          for (const item of files) {
            const xsdJson = await new Promise((resolve, reject) => {
              try {
                const json = xmljs.xml2js(item.xml, { compact: true });
                resolve(json);
              } catch (error) {
                reject(error);
              }
            });

            const xsdXml = xmljs.js2xml(xsdJson, { compact: true });
            onXmlChange(xsdXml, item.fileName);

            dispatch(addFile({ fileName: item.fileName, xml: xsdXml }));
            dispatch(selectFile({ fileName: item.fileName, xml: xsdXml }));

            results.push({ fileName: item.fileName, xsdXml });
          }

          setXsdTexts(results);
        }
      } catch (error) {
        console.error('Error parsing files', error);
      }
    },
    [dispatch, onXmlChange],
  );

  return { xsdTexts, setXsdTexts, parseXsd };
};

export default useXsdReaderStore;
