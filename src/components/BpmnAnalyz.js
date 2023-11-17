import React, { useState, useEffect } from 'react';

const BpmnAnalyz = ({ xsdXmls }) => {
  const [smevVersions, setSmevVersions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' (ascending) or 'desc' (descending)
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('all'); // 'all', 'smev2', 'smev3'

  useEffect(() => {
    const analyzeSmevVersions = () => {
      const versions = xsdXmls.map((xsdXml) => {
        return {
          fileName: xsdXml.fileName,
          version: extractSmevVersion(xsdXml.xml),
        };
      });

      // Сортируем массив по версии SMEV и учитываем порядок сортировки
      versions.sort((a, b) => {
        const compareResult = a.version.localeCompare(b.version);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      });

      setSmevVersions(versions);
    };

    const extractSmevVersion = (xml) => {
      const matches = xml.match(/#\{(smev\d+)\./);
      return matches && matches[1] ? matches[1] : 'smev2';
    };

    analyzeSmevVersions();
  }, [xsdXmls, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSelectVersion = (version) => {
    setSelectedSmevVersion(version);
  };

  // Фильтрация версий в соответствии с выбранной версией
  const filteredSmevVersions =
    selectedSmevVersion === 'all'
      ? smevVersions
      : smevVersions.filter((xsdXml) => xsdXml.version === selectedSmevVersion);

  return (
    <div>
      <h2>BPMN Analyzer</h2>
      <button onClick={toggleSortOrder}>
        Toggle Sort Order ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      <div>
        <label>
          Show version:
          <select onChange={(e) => handleSelectVersion(e.target.value)} value={selectedSmevVersion}>
            <option value="all">All Versions</option>
            <option value="smev2">SMEV2</option>
            <option value="smev3">SMEV3</option>
          </select>
        </label>
      </div>
      {filteredSmevVersions.map((xsdXml, index) => (
        <div key={index}>
          <h3>File {index + 1}</h3>
          <p>Name: {xsdXml.fileName}</p>
          <p>SMEV Version: {xsdXml.version}</p>
        </div>
      ))}
    </div>
  );
};

export default BpmnAnalyz;
