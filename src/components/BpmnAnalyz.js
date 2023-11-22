import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const BpmnAnalyz = ({ xsdXmls }) => {
  const [smevVersions, setSmevVersions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const analyzeSmevVersions = () => {
      const versions = xsdXmls.map((xsdXml) => ({
        fileName: xsdXml.fileName,
        version: extractSmevVersion(xsdXml.xml),
        processName: extractProcessName(xsdXml.xml),
      }));

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

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976D2',
      },
      secondary: {
        main: '#FF4081',
      },
    },
    typography: {
      h2: {
        fontSize: '1.5rem', // размер заголовка
        fontFamily: 'cursive',
        marginBottom: '10px',
      },
      h3: {
        fontSize: '1rem', // размер заголовка внутри файла
        fontFamily: 'cursive',
        marginBottom: '5px',
      },
      body1: {
        fontSize: '1rem', // размер текста
        fontFamily: 'sans-serif',
        margin: '5px 0',
      },
      button: {
        fontSize: '1rem', // размер кнопки
        marginBottom: '10px',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.container}>
        <Typography variant="h2" style={styles.header}>
          BPMN Analyzer
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={styles.button}
          onClick={toggleSortOrder}
        >
          Переключить порядок сортировки ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </Button>
        <div style={styles.selectContainer}>
          <label style={styles.label}>
            Show version:
            <Select
              style={styles.select}
              onChange={(e) => handleSelectVersion(e.target.value)}
              value={selectedSmevVersion}
            >
              <MenuItem value="all">All Versions</MenuItem>
              <MenuItem value="smev2">SMEV2</MenuItem>
              <MenuItem value="smev3">SMEV3</MenuItem>
            </Select>
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
            <Typography variant="h3" style={styles.fileHeader}>
              File {index + 1}
            </Typography>
            <Typography variant="body1" style={styles.fileName}>
              Name: {xsdXml.fileName}
            </Typography>
            <Typography variant="body1" style={styles.version}>
              SMEV Version: {xsdXml.version}
            </Typography>
            <Typography variant="body1" style={styles.processName}>
              Process Name: {xsdXml.processName}
            </Typography>
          </div>
        ))}
      </div>
    </ThemeProvider>
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
  },
  fileName: {
    margin: '5px 0',
  },
  version: {
    margin: '5px 0',
  },
  processName: {
    margin: '5px 0',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: '5px',
  },
};

export default BpmnAnalyz;
