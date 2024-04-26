import React from 'react';
import selectFile from '../../Redux/fileSlice';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TabIndicator from '../UI/icon/TabIndicator.svg';
import TablePagination from '@mui/material/TablePagination';
import BpmnDiagram from '../BpmnDiagram/BpmnDiagram';

const BpmnAnalyzContent = ({
  searchTerm,
  handleSearch,
  selectedSmevVersion,
  handleSelectVersion,
  smevVersions,
  selectedCalledElement,
  handleCalledElementChange,
  toggleSortOrder,
  sortOrder,
  showLockedOnly,
  toggleShowLockedOnly,
  handleChangePage,
  handleChangeRowsPerPage,
  page,
  rowsPerPage,
  filteredSmevVersions,
  dispatch,
  onFileSelect,
  handleActiv,
  isBpmnDiagramOpen,
  getXmlDataForFile,
  selectedFileName,
}) => {
  return (
    <div>
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
        <FormControl variant="standard" sx={{ m: 1, minWidth: 367 }}>
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
            minWidth: 947,
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
            {[...new Set(smevVersions.map(xsdXml => xsdXml.calledElement))].map(
              calledElement => (
                <MenuItem key={calledElement} value={calledElement}>
                  {calledElement}
                </MenuItem>
              ),
            )}
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
      <div style={styles.buttonGroupBottom}>
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
                marginLeft: '650px',
                marginY: 2,
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
              aria-label="add to shopping cart"
            >
              <SaveAltIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
      <TableContainer component={Paper} style={styles.fileContainer}>
        <Table
          sx={{
            backgroundColor: '#D6D9DC',
            borderTopLeftRadius: '40px',
            borderTopRightRadius: '40px',
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
            borderBottom: '11px solid #ffffff',
          }}
        >
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
              <TableCell>Код</TableCell>
              <TableCell>Название файла</TableCell>
              <TableCell>Версия СМЭВ</TableCell>
              <TableCell></TableCell>
              <TableCell>Process Name</TableCell>
              <TableCell>
                Статус и наименование межведомственного запроса
              </TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Дата изменения</TableCell>
              {/* <TableCell>Удалить</TableCell> */}
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
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                    borderRadius: '20px',
                    background: '#F5F7FA',
                    borderBottom: '11px solid #ffffff',
                  }}
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
                    {/* <Indicator locked={xsdXml.locked} /> */}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{ cursor: 'pointer' }}>
                    <div onClick={() => handleActiv(xsdXml.fileName)}>
                      {xsdXml.fileName}
                    </div>
                  </TableCell>
                  <TableCell>{xsdXml.version}</TableCell>
                  <TableCell>
                    {/* <Indicator locked={xsdXml.locked} /> */}
                  </TableCell>
                  <TableCell>{xsdXml.processName}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{xsdXml.dateCreated}</TableCell>
                  <TableCell>{xsdXml.dateUpDated}</TableCell>
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  buttonGroupBottom: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  fileContainer: {
    border: '1px solid #ccc',
    marginTop: '20px',
    background: '#FFFFFF',
    borderRadius: '20px',
    margin: '5px 0',
    padding: '10px 10px',
    marginLeft: '-10px',
  },
};

export default BpmnAnalyzContent;
