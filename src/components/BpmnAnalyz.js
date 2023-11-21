import React, { useState, useEffect } from 'react';

const BpmnAnalyz = ({ xsdXmls }) => {
  const [smevVersions, setSmevVersions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const analyzeSmevVersions = () => {
      const versions = xsdXmls.map((xsdXml) => {
        return {
          fileName: xsdXml.fileName,
          version: extractSmevVersion(xsdXml.xml),
          processName: extractProcessName(xsdXml.xml),
        };
      });

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

    const extractProcessName = (xml) => {
      const matches = xml.match(/<process.*?name="(.*?)"/);
      return matches && matches[1] ? matches[1] : 'Unknown Process Name';
    };

    analyzeSmevVersions();
  }, [xsdXmls, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSelectVersion = (version) => {
    setSelectedSmevVersion(version);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSmevVersions =
    selectedSmevVersion === 'all'
      ? smevVersions.filter((xsdXml) => xsdXml.processName.toLowerCase().includes(searchTerm.toLowerCase()))
      : smevVersions.filter(
          (xsdXml) => xsdXml.version === selectedSmevVersion && xsdXml.processName.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>BPMN Analyzer</h2>
      <button style={styles.button} onClick={toggleSortOrder}>
        Переключить порядок сортировки ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      <div style={styles.selectContainer}>
        <label style={styles.label}>
          Show version:
          <select style={styles.select} onChange={(e) => handleSelectVersion(e.target.value)} value={selectedSmevVersion}>
            <option value="all">All Versions</option>
            <option value="smev2">SMEV2</option>
            <option value="smev3">SMEV3</option>
          </select>
        </label>
      </div>
      <div style={styles.searchContainer}>
        <label style={styles.label}>
          Поиск по Process name:
          <input style={styles.input} type="text" value={searchTerm} onChange={handleSearch} />
        </label>
      </div>
      {filteredSmevVersions.map((xsdXml, index) => (
        <div key={index} style={styles.fileContainer}>
          <h3 style={styles.fileHeader}>File {index + 1}</h3>
          <p style={styles.fileName}>Name: {xsdXml.fileName}</p>
          <p style={styles.version}>SMEV Version: {xsdXml.version}</p>
          <p style={styles.processName}>Process Name: {xsdXml.processName}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '10px', // Закругленные углы
    backgroundColor: '#ffffff', // Белый фон
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Тень
  },
  header: {
    marginBottom: '10px',
    fontFamily: 'cursive', // Красивый шрифт
  },
  button: {
    marginBottom: '10px',
  },
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginLeft: '10px',
  },
  select: {
    marginLeft: '5px',
  },
  fileContainer: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '8px', // Закругленные углы
    backgroundColor: '#ffffff', // Белый фон
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', // Тень
  },
  fileHeader: {
    marginBottom: '5px',
    fontFamily: 'cursive', // Красивый шрифт
  },
  fileName: {
    margin: '5px 0',
    fontFamily: 'sans-serif', // Красивый шрифт
  },
  version: {
    margin: '5px 0',
    fontFamily: 'sans-serif', // Красивый шрифт
  },
  processName: {
    margin: '5px 0',
    fontFamily: 'sans-serif', // Красивый шрифт
  },
};

export default BpmnAnalyz;
