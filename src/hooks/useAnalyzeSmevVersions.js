import { useState, useEffect } from 'react';

export const useAnalyzeSmevVersions = (
  xsdXmls,
  bpmnAdministrative,
  options,
) => {
  const {
    sortOrder,
    selectedSmevVersion,
    selectedCalledElement,
    searchTerm,
    showLockedOnly,
  } = options;

  const [smevVersions, setSmevVersions] = useState([]);
  const [filteredSmevVersions, setFilteredSmevVersions] = useState([]);

  useEffect(() => {
    const analyzeSmevVersions = () => {
      const versions = xsdXmls.map(xsdXml => ({
        fileName: xsdXml.fileName,
        version: extractSmevVersion(xsdXml.xml),
        processName: extractProcessName(xsdXml.xml),
        calledElement: extractCalledElement(xsdXml.xml),
        locked: xsdXml.locked,
        dateCreated: extractDateCreated(bpmnAdministrative),
        dateUpDated: extractdateUpDated(bpmnAdministrative),
      }));

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

    analyzeSmevVersions();
  }, [
    xsdXmls,
    sortOrder,
    selectedSmevVersion,
    selectedCalledElement,
    searchTerm,
    showLockedOnly,
    bpmnAdministrative,
  ]);

  const extractDateCreated = xml => {
    const matches = xml.match(/"datecreated":"([^"]+)"/);
    return matches && matches[1] ? matches[1] : '';
  };

  const extractdateUpDated = xml => {
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

  return { smevVersions, filteredSmevVersions };
};
