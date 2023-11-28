import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BpmnDiagram from './BpmnDiagram';

const BpmnAnalyz = ({ xsdXmls, onFileSelect }) => {
  const [smevVersions, setSmevVersions] = useState([]);
  const [filteredSmevVersions, setFilteredSmevVersions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isBpmnDiagramOpen, setIsBpmnDiagramOpen] = useState(false);

  useEffect(() => {
    const analyzeSmevVersions = () => {
      const versions = xsdXmls.map((xsdXml) => ({
        fileName: xsdXml.fileName,
        version: extractSmevVersion(xsdXml.xml),
        processName: extractProcessName(xsdXml.xml),
        isGreen: isFileGreen(xsdXml.fileName),
      }));

      versions.sort((a, b) => {
        const compareResult = a.version.localeCompare(b.version);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      });

      const filteredSmevVersions =
        selectedSmevVersion === 'all'
          ? versions.filter((xsdXml) => xsdXml.processName.toLowerCase().includes(searchTerm.toLowerCase()))
          : versions.filter(
              (xsdXml) =>
                xsdXml.version === selectedSmevVersion && xsdXml.processName.toLowerCase().includes(searchTerm.toLowerCase())
            );

      setSmevVersions(versions);
      setFilteredSmevVersions(filteredSmevVersions);
    };

    const extractSmevVersion = (xml) => {
      const matches = xml.match(/#\{(smev\d+)\./);
      return matches && matches[1] ? matches[1] : 'smev2';
    };

    const extractProcessName = (xml) => {
      const matches = xml.match(/<process.*?name="(.*?)"/);
      return matches && matches[1] ? matches[1] : 'Unknown Process Name';
    };

    const isFileGreen = (fileName) => {
      return fileName.length % 2 === 0;
    };

    analyzeSmevVersions();
  }, [xsdXmls, sortOrder, selectedSmevVersion, searchTerm]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSelectVersion = (version) => {
    setSelectedSmevVersion(version);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleShowInactive = () => {
    console.log('Showing inactive data...');
  };

  const handleServiceDeadline = () => {
    console.log('Setting service deadline...');
  };

  const handleActiv = (fileName) => {
    setSelectedFileName(fileName);
    setIsBpmnDiagramOpen(true); // Открывать BpmnDiagram при выборе файла
  };

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
        fontSize: '1.5rem',
        fontFamily: 'cursive',
        marginBottom: '10px',
      },
      h3: {
        fontSize: '1rem',
        fontFamily: 'cursive',
        marginBottom: '5px',
      },
      body1: {
        fontSize: '1rem',
        fontFamily: 'sans-serif',
        margin: '5px 0',
      },
      button: {
        fontSize: '1rem',
        marginBottom: '10px',
      },
    },
  });

  const getXmlDataForFile = (fileName) => {
    const selectedFile = xsdXmls.find((xsdXml) => xsdXml.fileName === fileName);
    return selectedFile ? selectedFile.xml : '';
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={styles.container}>
        <Typography variant="h2" style={styles.header}>
          BPMN Analyzer
        </Typography>
        <div style={styles.buttonGroup}>
          <div style={styles.buttonGroupTop}>
            <label style={styles.label}>
              Показать версию:
              <Select style={styles.select} onChange={(e) => handleSelectVersion(e.target.value)} value={selectedSmevVersion}>
                <MenuItem value="all">Все версии</MenuItem>
                <MenuItem value="smev2">SMEV2</MenuItem>
                <MenuItem value="smev3">SMEV3</MenuItem>
              </Select>
            </label>
          </div>
          <div style={styles.buttonGroupTop}>
            <label style={styles.label}>
              Поиск по Process name:
              <TextField style={styles.input} type="text" value={searchTerm} onChange={handleSearch} />
            </label>
          </div>
          <div style={styles.buttonGroupBottom}>
            <Button variant="contained" color="primary" style={styles.actionButton} onClick={toggleSortOrder}>
              Переключить порядок сортировки ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </Button>
            <Button variant="contained" color="primary" style={styles.actionButton} startIcon={<CloudDownloadIcon />} onClick={handleExport}>
              Выгрузить
            </Button>
            <Button variant="contained" color="primary" style={styles.actionButton} startIcon={<VisibilityIcon />} onClick={handleShowInactive}>
              Показать неактивные
            </Button>
            <Button variant="contained" color="primary" style={styles.actionButton} startIcon={<ScheduleIcon />} onClick={handleServiceDeadline}>
              Наим. из карт. прод.
            </Button>
          </div>
        </div>
        <TableContainer component={Paper} style={styles.fileContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Файл</TableCell>
                <TableCell>Название файла</TableCell>
                <TableCell>Версия SMEV</TableCell>
                <TableCell>Process Name</TableCell>
                <TableCell>Наличие межведа</TableCell>
                <TableCell>Тип процедуры</TableCell>
                <TableCell>Срок оказания процедуры</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSmevVersions.map((xsdXml, index) => (
                <TableRow
                  key={index}
                  style={styles.row}
                  onClick={() => onFileSelect && onFileSelect(xsdXml.fileName)}
                >
                  <TableCell>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: xsdXml.isGreen ? 'green' : 'red',
                        marginRight: '5px',
                      }}
                    ></div>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ cursor: 'pointer' }}>
                    <div onClick={() => handleActiv(xsdXml.fileName)}>{xsdXml.fileName}</div>
                  </TableCell>
                  <TableCell>{xsdXml.version}</TableCell>
                  <TableCell>{xsdXml.processName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isBpmnDiagramOpen && (
          <BpmnDiagram xml={getXmlDataForFile(selectedFileName)} />
        )}
      </div>
    </ThemeProvider>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
  },
  buttonGroupTop: {
    marginBottom: '10px',
  },
  buttonGroupBottom: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  actionButton: {
    fontSize: '0.8rem',
    flex: 1,
    marginRight: '10px',
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
  input: {
    marginLeft: '5px',
  },
  fileContainer: {
    border: '1px solid #ccc',
    marginTop: '10px',
  },
  row: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
};

export default BpmnAnalyz;
