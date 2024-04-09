import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from '@mui/material';
import XsdReader from '../components/XsdReader';
import { selectFiles } from '../Redux/fileSlice';
import './BpmnList.css';

const BpmnList = () => {
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);
  const [bpmnAdministrative, setbpmnAdministrative] = useState('');
  const [xsdXmls, setXsdXmls] = useState([]);
  const [showXsdReader, setShowXsdReader] = useState(false);
  const [showLockedOnly, setShowLockedOnly] = useState(false); // Состояние фильтрации

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || '') + '/api/bpmnAdministrative')
      .then(response => response.text())
      .then(data => {
        setbpmnAdministrative(data);
        console.log('Данные из /api/bpmnAdministrative:', data);
      })
      .catch(error =>
        console.error('Ошибка при получении данных BPMN:', error),
      );
  }, [dispatch]);

  const handleXmlChange = (xml, fileName) => {
    setXsdXmls(prevXmls => [...prevXmls, { xml, fileName }]);
  };

  const Indicator = ({ locked }) => {
    const indicatorClassName = locked ? 'indicator green' : 'indicator red';
    return <div className={indicatorClassName}></div>;
  };

  const toggleShowLockedOnly = () => {
    setShowLockedOnly(prevState => !prevState); // Переключение состояния фильтрации
  };

  const renderBpmnRows = () => {
    let parsedData = [];
    try {
      parsedData = JSON.parse(bpmnAdministrative);
    } catch (error) {
      console.error('Ошибка при парсинге BPMN данных:', error);
    }
    if (!parsedData || !Array.isArray(parsedData)) {
      return (
        <TableRow>
          <TableCell colSpan={4}>No BPMN data available</TableCell>
        </TableRow>
      );
    }
    let filteredData = parsedData;
    if (showLockedOnly) {
      // Фильтрация только для заблокированных записей, если флаг установлен
      filteredData = parsedData.filter(data => data.locked === true);
    }
    return filteredData.map((data, index) => (
      <TableRow key={index}>
        <TableCell>{data.id}</TableCell>
        <TableCell>{data.name}</TableCell>
        <TableCell>{data.locked ? 'true' : 'false'}</TableCell>
        <TableCell>
          <Indicator locked={data.locked} />
        </TableCell>
      </TableRow>
    ));
  };

  const renderFileRows = () => {
    if (!files || !Array.isArray(files)) {
      return (
        <TableRow>
          <TableCell colSpan={1}>No data available</TableCell>
        </TableRow>
      );
    }
    const sortedData = [...files].sort((a, b) =>
      a.fileName.localeCompare(b.fileName),
    );
    return sortedData.map((file, index) => (
      <TableRow key={index}>
        <TableCell>{file.fileName}</TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <Button
        onClick={toggleShowLockedOnly}
        variant="contained"
        color="primary"
        className="custom-button"
        classes={{ root: 'custom-button' }}
      >
        {showLockedOnly ? 'Показать все' : 'Показать только заблокированные'}
      </Button>
      {showXsdReader && (
        <div className="One">
          <XsdReader onXmlChange={handleXmlChange} bpmnAdministrative={bpmnAdministrative} />
        </div>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>XML ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Locked</TableCell>
              <TableCell>Indicator</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderBpmnRows()}</TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя файла</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderFileRows()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BpmnList;
