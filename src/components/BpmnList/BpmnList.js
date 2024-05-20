import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '../UI/icon/SaveIcon.svg';
import { InputAdornment } from '@mui/material';
import { selectFiles } from '../../Redux/fileSlice';
import './BpmnList.css';
import TabIndicator from '../UI/icon/TabIndicator.svg';
import ThreeVertDots from '../UI/icon/ThreeVertDots';

const BpmnList = () => {
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showStatusColumn, setShowStatusColumn] = useState(false);

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

  const renderFileRows = () => {
    if (!files || !Array.isArray(files)) {
      return (
        <TableRow>
          <TableCell colSpan={1}>Нет доступных данных</TableCell>
        </TableRow>
      );
    }
    const sortedData = [...files].sort((a, b) =>
      a.fileName.localeCompare(b.fileName),
    );

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return sortedData.slice(startIndex, endIndex).map((file, index) => (
      <TableRow key={index}>
        <TableCell>
          <Indicator locked={file.locked} />
        </TableCell>
        <TableCell style={{ cursor: 'pointer' }}>{file.fileName}</TableCell>
        <TableCell>{file.version}</TableCell>
        <TableCell>{file.processName}</TableCell>
        <TableCell>{file.calledElement}</TableCell>
        <TableCell>{file.dateUpDated}</TableCell>
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
                value={''}
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
              style={{
                marginTop: '7px',
              }}
              id="standard-basic"
              label="Код"
              variant="standard"
              type="text"
              value={''}
              placeholder="Код"
            />
          </div>

          <div className="filter__item">
            <FormControl variant="standard" sx={{ m: 1, width: 223 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Тип процедуры
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={''}
                label="Тип процедуры"
              >
                <MenuItem value="">
                  <em>Тип процедуры</em>
                </MenuItem>
                <MenuItem value="all">Все версии</MenuItem>
                <MenuItem value="smev2">СМЭВ2</MenuItem>
                <MenuItem value="smev3">СМЭВ3</MenuItem>
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
                aria-label="add to shopping cart"
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
                  <TableCell>Код</TableCell>
                  <TableCell>Наименование</TableCell>
                  <TableCell>Версия СМЭВ</TableCell>
                  <TableCell>Тип процедуры</TableCell>
                  <TableCell>Дата обновления</TableCell>
                  <TableCell>
                    <ThreeVertDots onClick={toggleStatusColumn} />
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
            count={files.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default BpmnList;
