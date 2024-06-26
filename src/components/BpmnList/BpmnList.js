import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
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
  TablePagination,
  Menu,
  InputAdornment,
} from '@mui/material';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '../UI/icon/SaveIcon.svg';
import { selectFiles, selectXsdXmls, setXsdXmls } from '../../Redux/fileSlice';
import './BpmnList.css';
import TabIndicator from '../UI/icon/TabIndicator.svg';
import ThreeVertDots from '../UI/icon/ThreeVertDots';
import XsdReader from '../XsdReader/XsdReader';
import BpmnDiagram from '../../components/BpmnDiagram/BpmnDiagram';
import useXsdReader from '../../hooks/useXsdReader';
import { useAnalyzeSmevVersions } from '../../hooks/useAnalyzeSmevVersions';
import useXsdReaderStore from '../../hooks/useXsdReaderStore';
import useBpmnData from '../../hooks/useBpmnData';
import { useTypeprocedure } from '../../hooks/useTypeprocedure';
import { useRegCode } from '../../hooks/useRegCode';
const columnNames = {
  code: 'Код',
  processName: 'Наименование услуги',
  version: 'Версия СМЭВ',
  calledElement: 'Тип процедуры',
  dateUpDated: 'Дата обновления',
};

const BpmnList = () => {
  const dispatch = useDispatch();
  const files = useSelector(state => state.file.files);
  const xsdXmls = useSelector(state => state.file.files);
  // console.log(xsdXmls);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSmevVersion, setSelectedSmevVersion] = useState('all');
  const [selectedCalledElement, setSelectedCalledElement] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showStatusColumn, setShowStatusColumn] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([
    'processName',
    'calledElement',
    'dateUpDated',
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isBpmnDiagramOpen, setIsBpmnDiagramOpen] = useState(false);
  const [selectedXml, setSelectedXml] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  // const [smevVersions, setSmevVersions] = useState([]);
  // const [filteredSmevVersions, setFilteredSmevVersions] = useState([]);
  const [arr, setArr] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [selectedProcedureType, setSelectedProcedureType] = useState('');
  const { bpmnData, bpmnAdministrative, bpmnMezved, bpmnMezvedCatalog } =
    useBpmnData();

  const handleXmlChange = useCallback((xsdXml, fileName) => {
    // console.log('xsdXml:', xsdXml);
    // console.log('File name:', fileName);
  }, []);
  useEffect(() => {
    parseXsd(files);
    setArr(files);
    console.log(arr);
  }, []);

  const { parseXsd, xsdTexts } = useXsdReaderStore({
    onXmlChange: handleXmlChange,
  });

  const { smevVersions, filteredSmevVersions } = useAnalyzeSmevVersions(
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

  const handleFileClick = (fileName, xsdXml) => {
    setSelectedFile({ fileName, xsdXml });
    setIsBpmnDiagramOpen(true);
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const toggleShowLockedOnly = () => {
    setShowLockedOnly(prevState => !prevState);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSelectVersion = version => {
    setSelectedSmevVersion(version);
  };
  const handleSearchCode = event => {
    setSearchCode(event.target.value);
  };
  const handleSelectProcedureType = event => {
    setSelectedProcedureType(event.target.value);
  };

  const renderFileRows = () => {
    if (!xsdTexts || !Array.isArray(xsdTexts)) {
      return (
        <TableRow>
          <TableCell colSpan={visibleColumns.length}>
            Нет доступных данных
          </TableCell>
        </TableRow>
      );
    }
    const sortedData = [...filteredSmevVersions].sort((a, b) =>
      a.fileName.localeCompare(b.fileName),
    ); //xsdTexts вместо filteredSmevVersions иначе не отображается BpmnDiagram для кликнутого файла в таб, а с ним не работает фильтр по СМЭВ

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const typeProcedures = getTypeProcedures();

    return sortedData
      .filter((file, index) => {
        return (
          (selectedProcedureType === '' ||
            typeProcedures[index] === selectedProcedureType) &&
          (searchCode === '' || typeRegCode[index]?.startsWith(searchCode))
        );
      })
      .slice(startIndex, endIndex)
      .map((file, index) => (
        <TableRow
          key={index}
          onClick={() => handleFileClick(file.fileName, file.xsdXml)}
        >
          <TableCell>
            <Indicator locked={file.locked} />
          </TableCell>
          {visibleColumns.includes('code') && (
            <TableCell>{typeRegCode[index]}</TableCell>
          )}
          {visibleColumns.includes('processName') && (
            <TableCell>{file.fileName}</TableCell>
          )}
          {visibleColumns.includes('version') && (
            <TableCell>{file.version}</TableCell>
          )}
          {visibleColumns.includes('calledElement') && (
            <TableCell>{typeProcedures[index]}-сведения</TableCell>
          )}
          {visibleColumns.includes('dateUpDated') && (
            <TableCell>{file.dateUpDated}</TableCell>
          )}
          <TableCell></TableCell>
        </TableRow>
      ));
  };

  const Indicator = ({ locked }) => {
    const indicatorClassName = locked ? 'indicator red' : 'indicator green';
    return <div className={indicatorClassName}></div>;
  };

  const toggleStatusColumn = () => {
    setShowStatusColumn(prevState => !prevState);
  };
  const { data, error, getTypeProcedures } = useTypeprocedure();

  useEffect(() => {
    if (data.length > 0) {
      console.log('Type Procedures:', getTypeProcedures());
    }
    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, error, getTypeProcedures]);
  const { getRegCodes } = useRegCode();
  const typeRegCode = getRegCodes();

  return (
    <div className="mezved">
      <div className="mezved__bpmn">
        <TextField
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Наименование межведомственного запроса"
          sx={{
            width: '100%',
            height: '100%',
            marginBottom: '20px',
            '& .MuiInputBase-root': {
              borderRadius: '30px',
              width: '100%',
              background: '#F5F7FA',
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
        <div className="filter">
          <div className="filter__item">
            <FormControl variant="standard" sx={{ m: 1, width: 223 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Версия СМЭВ:
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedSmevVersion}
                onChange={event => handleSelectVersion(event.target.value)}
                label="Версия СМЭВ:"
              >
                <MenuItem value="">
                  <em>Версия СМЭВ:</em>
                </MenuItem>
                <MenuItem value="all">Все версии</MenuItem>
                <MenuItem value="smev2">СМЭВ2</MenuItem>
                <MenuItem value="smev3">СМЭВ3</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="filter__item">
            <FormControl variant="standard" sx={{ m: 1, width: 577 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Категории
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={''}
                label="Категории"
              >
                <MenuItem value="">Все элементы</MenuItem>
                <MenuItem value="element1">Элемент 1</MenuItem>
                <MenuItem value="element2">Элемент 2</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="filter__item">
            <TextField
              style={{ marginTop: '7px' }}
              id="standard-basic"
              label="Код"
              variant="standard"
              type="text"
              value={searchCode}
              onChange={handleSearchCode}
              placeholder="Код"
            />
          </div>

          <div className="filter__item">
            <FormControl variant="standard" sx={{ m: 1, width: 223 }}>
              <InputLabel id="procedure-type-select-label">
                Тип процедуры
              </InputLabel>
              <Select
                labelId="procedure-type-select-label"
                id="procedure-type-select"
                value={selectedProcedureType}
                onChange={handleSelectProcedureType}
                label="Тип процедуры"
              >
                <MenuItem value="">
                  <em>Все типы процедур</em>
                </MenuItem>
                <MenuItem value="G">G-сведения</MenuItem>
                <MenuItem value="P">P-сведения</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="filter__item">
            <FormControlLabel
              control={
                <Checkbox
                  checked={showLockedOnly}
                  onChange={toggleShowLockedOnly}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Отображать услуги с не активными межведомственными запросами"
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginTop: '25px',
              }}
            />
          </div>
        </div>
        <div className="button_tab">
          <Grid container spacing={2}>
            <Grid item>
              <Button
                className="apply_button"
                variant="outlined"
                sx={{
                  bgcolor: '#F5F7FA',
                  borderRadius: 20,
                  color: 'black',
                  borderColor: 'white',
                  marginLeft: '850px',
                  marginY: 2,
                  textTransform: 'capitalize',
                }}
              >
                Применить
              </Button>
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
              <IconButton
                className="download_button"
                color="primary"
                sx={{
                  bgcolor: '#F5F7FA',
                  marginY: 2,
                  color: '#000000',
                }}
              >
                <img src={SaveIcon} alt="SaveIcon" className="icon-image" />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <div className="mezved_tab">
          <TableContainer>
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
                    <TableCell>Код</TableCell>
                  )}
                  {visibleColumns.includes('processName') && (
                    <TableCell>Наименование</TableCell>
                  )}
                  {visibleColumns.includes('version') && (
                    <TableCell>Версия СМЭВ</TableCell>
                  )}
                  {visibleColumns.includes('calledElement') && (
                    <TableCell>Тип процедуры</TableCell>
                  )}
                  {visibleColumns.includes('dateUpDated') && (
                    <TableCell>Дата обновления</TableCell>
                  )}
                  <TableCell>
                    <IconButton
                      aria-controls="column-menu"
                      aria-haspopup="true"
                      onClick={handleMenuOpen}
                      style={{ float: 'right' }}
                    >
                      <ThreeVertDots />
                    </IconButton>
                    <Menu
                      id="column-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {Object.keys(columnNames).map(column => (
                        <MenuItem
                          key={column}
                          onClick={() => handleColumnToggle(column)}
                        >
                          <Checkbox checked={visibleColumns.includes(column)} />
                          {columnNames[column]}
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderFileRows()}</TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Строк на странице:"
            component="div"
            count={xsdTexts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        {selectedFile && (
          <Modal
            open={isBpmnDiagramOpen}
            onClose={() => setIsBpmnDiagramOpen(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
              overflowY: 'auto',
            }}
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
                  xml={selectedFile.xsdXml}
                  filename={selectedFile.fileName}
                  onClose={() => setIsBpmnDiagramOpen(false)}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default BpmnList;
