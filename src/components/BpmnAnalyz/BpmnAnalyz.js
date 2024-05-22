import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  FormControlLabel,
  FormControl,
  InputLabel,
  Checkbox,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import BpmnDiagram from '../BpmnDiagram/BpmnDiagram';
import '../BpmnAnalyz/BpmnAnalyz.css';
import {
  addFile,
  selectFile,
  selectFiles,
  selectSelectedFile,
} from '../../Redux/fileSlice';
import TabIndicator from '../UI/icon/TabIndicator.svg';
import SaveIcon from '../UI/icon/SaveIcon.svg';
import ThreeVertDots from '../UI/icon/ThreeVertDots';

export const Indicator = ({ locked }) => {
  const indicatorClassName = locked ? 'indicator red' : 'indicator green';
  return <div className={indicatorClassName}></div>;
};

const columnNames = {
  code: 'Код',
  processName: 'Наименование услуги',
  dateCreated: 'Дата создания',
  dateUpDated: 'Дата изменения',
  status: '',
  servicePeriod: 'Срок оказания услуги',
  calledElement: 'Статус и наименование межведомственного запроса',
  version: 'Версия СМЭВ',
};

const BpmnAnalyz = ({ xsdXmls, onFileSelect, bpmnAdministrative }) => {
  const [smevVersions, setSmevVersions] = useState([]);
  const [filteredSmevVersions, setFilteredSmevVersions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isBpmnDiagramOpen, setIsBpmnDiagramOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const [showInactive, setShowInactive] = useState(false);

  const files = useSelector(selectFiles);
  const selectedFile = useSelector(selectSelectedFile);
  const [selectedCalledElement, setSelectedCalledElement] = useState('');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [showStatusColumn, setShowStatusColumn] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1176);
  const [anchorEl, setAnchorEl] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([
    'processName',
    'dateCreated',
    'dateUpDated',
  ]);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = column => {
    setVisibleColumns(prevVisibleColumns => {
      if (prevVisibleColumns.includes(column)) {
        return prevVisibleColumns.filter(col => col !== column);
      } else {
        return [...prevVisibleColumns, column];
      }
    });
  };

  useEffect(() => {
    const analyzeSmevVersions = () => {
      const versions = xsdXmls.map(xsdXml => ({
        fileName: xsdXml.fileName,
        version: extractSmevVersion(xsdXml.xml),
        processName: extractProcessName(xsdXml.xml),
        isGreen: isLocked(xsdXml.fileName),
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

    const isLocked = fileName => {
      return fileName.length % 2 === 0;
    };

    analyzeSmevVersions();
  }, [
    xsdXmls,
    sortOrder,
    selectedSmevVersion,
    selectedCalledElement,
    searchTerm,
  ]);

  let parsedData = [];

  try {
    parsedData = JSON.parse(bpmnAdministrative);
  } catch (error) {
    console.error('Ошибка при парсинге BPMN данных:', error);
  }

  const toggleShowLockedOnly = () => {
    setShowLockedOnly(prevState => !prevState); // Переключение состояния фильтрации
  };

  let filteredData = parsedData;
  if (showLockedOnly) {
    filteredData = parsedData.filter(data => data.locked === true);
  }

  if (!parsedData || !Array.isArray(parsedData)) {
    return <div>No BPMN data available</div>;
  }

  const extractCalledElement = xml => {
    const matches = xml.match(
      /<callActivity id="([^"]+)" name="([^"]+)" calledElement="([^"]+)"/,
    );
    return matches && matches[3] ? matches[3] : '';
  };

  const handleCalledElementChange = calledElement => {
    setSelectedCalledElement(calledElement);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSelectVersion = version => {
    setSelectedSmevVersion(version);
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleShowInactive = () => {
    setShowInactive(true);
  };

  const handleServiceDeadline = () => {
    console.log('Setting service deadline...');
  };

  const handleActiv = fileName => {
    setSelectedFileName(fileName);
    setIsBpmnDiagramOpen(true);
  };

  const handleFileUpload = newFile => {
    dispatch(addFile(newFile));
  };

  const getXmlDataForFile = fileName => {
    const selectedFile = xsdXmls.find(xsdXml => xsdXml.fileName === fileName);
    return selectedFile ? selectedFile.xml : '';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleStatusColumn = () => {
    setShowStatusColumn(prevState => !prevState);
    setContainerWidth(prevWidth => (prevWidth === 1176 ? 1500 : 1176));
  };

  return (
    <div className="gosuslugi" style={{ width: `${containerWidth}px` }}>
      <div className="gosuslugi__filter">
        <TextField
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Наименование услуги"
          sx={{
            width: '100%',
            height: '100%',
            marginBottom: '20px',
            '& .MuiInputBase-root': {
              borderRadius: '30px',
              width: '100%',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 223 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Версия СМЭВ:
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedSmevVersion}
              onChange={e => handleSelectVersion(e.target.value)}
              label="Версия СМЭВ:"
            >
              <MenuItem value="">
                <em>Версия СМЭВ:</em>
              </MenuItem>
              <MenuItem value="all">Все версии</MenuItem>
              <MenuItem value="smev2">SMEV2</MenuItem>
              <MenuItem value="smev3">SMEV3</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant="standard"
            sx={{
              m: 1,
              minWidth: 577,
              marginLeft: 'auto',
              marginRight: '-20px',
            }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Фильтр по Called Element:
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              onChange={e => handleCalledElementChange(e.target.value)}
              value={selectedCalledElement}
              label="Age"
            >
              <MenuItem value="">Все элементы</MenuItem>
              {[
                ...new Set(smevVersions.map(xsdXml => xsdXml.calledElement)),
              ].map(calledElement => (
                <MenuItem key={calledElement} value={calledElement}>
                  {calledElement}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <label
            style={{
              marginLeft: 'auto',
              marginRight: '-20px',
            }}
          >
            <TextField
              style={{
                marginLeft: 'auto',
                marginRight: '20px',
                marginTop: '8.5px',
              }}
              id="standard-basic"
              label="Код"
              variant="standard"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Код"
            />
          </label>
        </div>
        <div className="gosuslugi__button-group">
          <FormControlLabel
            control={
              <Checkbox
                checked={sortOrder === 'desc'}
                onChange={toggleSortOrder}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={`Переключить порядок сортировки (${sortOrder === 'asc' ? 'Возрастание' : 'Убывание'})`}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showLockedOnly}
                onChange={toggleShowLockedOnly}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Отображать услуги с не активными межведомственными запросами"
          />
          <div className="gosuslugi__button-tab">
            <Button
              className="apply_button"
              variant="outlined"
              sx={{
                bgcolor: '#F5F7FA',
                borderRadius: 20,
                color: 'black',
                borderColor: 'white',
                marginLeft: '300px',
                marginY: 2,
                textTransform: 'capitalize',
              }}
            >
              Применить
            </Button>
            <Button
              className="reset_button"
              variant="outlined"
              sx={{
                bgcolor: '#F5F7FA',
                borderRadius: 20,
                color: 'black',
                borderColor: 'white',
                marginY: 2,
                textTransform: 'capitalize',
              }}
            >
              Сбросить
            </Button>
            <IconButton
              className="download_button"
              color="primary"
              sx={{
                bgcolor: '#F5F7FA',
                marginY: 2,
                color: '#000000',
              }}
              aria-label="add to shopping cart"
            >
              <img src={SaveIcon} alt="SaveIcon" className="icon-image" />
            </IconButton>
          </div>
        </div>
      </div>
      <TableContainer className="gosuslugi_table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <img
                  src={TabIndicator}
                  alt="Иконка"
                  style={{
                    position: 'relative',
                    top: '5px',
                    left: '5px',
                  }}
                />
              </TableCell>
              {visibleColumns.includes('code') && (
                <TableCell>{columnNames['code']}</TableCell>
              )}
              {visibleColumns.includes('processName') && (
                <TableCell>{columnNames['processName']}</TableCell>
              )}
              {visibleColumns.includes('version') && (
                <TableCell>{columnNames['version']}</TableCell>
              )}
              {visibleColumns.includes('status') && (
                <TableCell>{columnNames['status']}</TableCell>
              )}
              {visibleColumns.includes('calledElement') && (
                <TableCell>{columnNames['calledElement']}</TableCell>
              )}
              {visibleColumns.includes('servicePeriod') && (
                <TableCell>{columnNames['servicePeriod']}</TableCell>
              )}
              {visibleColumns.includes('dateCreated') && (
                <TableCell>{columnNames['dateCreated']}</TableCell>
              )}
              {visibleColumns.includes('dateUpDated') && (
                <TableCell>{columnNames['dateUpDated']}</TableCell>
              )}
              <TableCell>
                <IconButton
                  color="primary"
                  aria-label="settings"
                  aria-controls="settings-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <ThreeVertDots />
                </IconButton>
                <Menu
                  id="settings-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem disabled>
                    Выберите столбцы для отображения:
                  </MenuItem>
                  {Object.keys(columnNames).map(column => (
                    <MenuItem key={column}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={visibleColumns.includes(column)}
                            onChange={() => handleColumnToggle(column)}
                          />
                        }
                        label={columnNames[column]}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSmevVersions
              .filter(xsdXml => {
                // Применяем фильтрацию к обоим массивам данных
                return (
                  xsdXml.fileName.includes(searchTerm) && // Фильтрация по поисковому термину
                  (showLockedOnly ? xsdXml.locked === true : true) // Фильтрация по locked, если выбрана опция показать только заблокированные
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((xsdXml, index) => (
                <TableRow
                  key={index}
                  onClick={() => {
                    dispatch(
                      selectFile({
                        fileName: xsdXml.fileName,
                        xml: xsdXml.xml,
                      }),
                    );
                    onFileSelect && onFileSelect(xsdXml.fileName, xsdXml.xml);
                  }}
                >
                  <TableCell>
                    <Indicator locked={xsdXml.locked} />
                  </TableCell>
                  {visibleColumns.includes('code') && <TableCell></TableCell>}
                  {visibleColumns.includes('processName') && (
                    <TableCell style={{ cursor: 'pointer' }}>
                      <div onClick={() => handleActiv(xsdXml.fileName)}>
                        {xsdXml.processName}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes('version') && (
                    <TableCell>{xsdXml.version}</TableCell>
                  )}
                  {visibleColumns.includes('status') && (
                    <TableCell>
                      <Indicator locked={xsdXml.locked} />
                    </TableCell>
                  )}
                  {visibleColumns.includes('calledElement') && (
                    <TableCell>{xsdXml.calledElement}</TableCell>
                  )}
                  {visibleColumns.includes('servicePeriod') && (
                    <TableCell></TableCell>
                  )}
                  {visibleColumns.includes('dateCreated') && (
                    <TableCell>{xsdXml.dateCreated}</TableCell>
                  )}
                  {visibleColumns.includes('dateUpDated') && (
                    <TableCell>{xsdXml.dateUpDated}</TableCell>
                  )}
                  <TableCell></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        labelRowsPerPage="Строк на странице:"
        count={filteredSmevVersions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {isBpmnDiagramOpen && (
        <BpmnDiagram
          xml={getXmlDataForFile(selectedFileName)}
          onCalledElementChange={handleCalledElementChange}
        />
      )}
    </div>
  );
};

export default BpmnAnalyz;
