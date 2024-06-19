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
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
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
import { useAnalyzeSmevVersions } from '../../hooks/useAnalyzeSmevVersions';
import useExecutionTime from '../../hooks/useExecutionTime';
import { useRegCode } from '../../hooks/useRegCode';

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
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isBpmnDiagramOpen, setIsBpmnDiagramOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const [showInactive, setShowInactive] = useState(false);
  const [searchCode, setSearchCode] = useState('');

  const files = useSelector(selectFiles);
  const selectedFile = useSelector(selectSelectedFile);
  const [selectedCalledElement, setSelectedCalledElement] = useState('');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1176);
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusColumnToggled, setStatusColumnToggled] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([
    'processName',
    'dateCreated',
    'dateUpDated',
  ]);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleCodeSearch = (event) => {
    setSearchCode(event.target.value);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = column => {
    setVisibleColumns(prevVisibleColumns => {
      let newVisibleColumns;
      if (prevVisibleColumns.includes(column)) {
        newVisibleColumns = prevVisibleColumns.filter(col => col !== column);
      } else {
        newVisibleColumns = [...prevVisibleColumns, column];
      }
      const selectedColumnCount = newVisibleColumns.length;

      if (selectedColumnCount > 3 && !statusColumnToggled) {
        toggleStatusColumn();
        setStatusColumnToggled(true);
      } else if (selectedColumnCount <= 3 && statusColumnToggled) {
        toggleStatusColumn();
        setStatusColumnToggled(false);
      }

      return newVisibleColumns;
    });
  };

  const { filteredSmevVersions } = useAnalyzeSmevVersions(
    xsdXmls,
    bpmnAdministrative,
    {
      sortOrder,
      selectedSmevVersion,
      selectedCalledElement,
      searchTerm,
      showLockedOnly,
    },
  );

  let parsedData = [];

  try {
    parsedData = JSON.parse(bpmnAdministrative);
  } catch (error) {
    console.error('Ошибка при парсинге BPMN данных:', error);
  }

  const toggleShowLockedOnly = () => {
    setShowLockedOnly(prevState => !prevState); // Переключение состояния фильтрации
  };

  if (!parsedData || !Array.isArray(parsedData)) {
    return <div>No BPMN data available</div>;
  }

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
    setContainerWidth(prevWidth => (prevWidth === 1176 ? 1500 : 1176));
  };
  const { executionTimes } = useExecutionTime();
  const { data, getRegCodes } = useRegCode();
  const typeRegCode = getRegCodes();

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
              <MenuItem value=""></MenuItem>
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
              value={searchCode}
              onChange={handleCodeSearch}
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
                  style={{ float: 'right' }}
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
                  xsdXml.fileName.includes(searchCode) &&
                  xsdXml.fileName.includes(searchTerm) && // Фильтрация по поисковому термину
                  (showLockedOnly ? xsdXml.locked === true : true) // Фильтрация по locked, если выбрана опция показать только заблокированные
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((xsdXml, index) => (
                <TableRow
                  key={index}
                  onClick={() => {
                    handleActiv(xsdXml.fileName);
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
                  {visibleColumns.includes('code') && (
                    <TableCell>{typeRegCode[index]}</TableCell>
                  )}
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
                    <TableCell>
                      {executionTimes[index]?.executionTime || 'Отсутствует'}
                    </TableCell>
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
      <Modal
        open={isBpmnDiagramOpen}
        onClose={() => setIsBpmnDiagramOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-container">
          <div className="modal-header">
            <IconButton
              aria-label="close"
              onClick={() => setIsBpmnDiagramOpen(false)}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'inherit',
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="modal-body">
            <BpmnDiagram
              xml={getXmlDataForFile(selectedFileName)}
              onCalledElementChange={handleCalledElementChange}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BpmnAnalyz;
