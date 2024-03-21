import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { selectFiles } from '../Redux/fileSlice';
import XsdReader from '../components/XsdReader';

const BpmnList = () => {
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);
  console.log('Данные из store:',files);
  const [bpmnData, setBpmnData] = useState('');
  const [xsdXmls, setXsdXmls] = useState([]);
  const [showXsdReader, setShowXsdReader] = useState(false);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "") + '/api/bpmnData')
      .then(response => response.text())
      .then(data => {
        setBpmnData(data);
        console.log('Данные из /api/bpmnData:', data);
      })
      .catch(error => console.error('Ошибка при получении данных BPMN:', error));
  }, [dispatch]);

  if (!files || !Array.isArray(files)) {
    return <div>No data available</div>;
  }
  const handleXmlChange = (xml, fileName) => {
    setXsdXmls((prevXmls) => [...prevXmls, { xml, fileName }]);
  };

  const sortedData = [...files].sort((a, b) => {
    return a.fileName.localeCompare(b.fileName);
  });

  return (
    <div>
      {showXsdReader && ( // Условный рендеринг - показывать XsdReader только если showXsdReader равно true
        <div className='One'>
          <XsdReader onXmlChange={handleXmlChange} bpmnData={bpmnData}/>
        </div>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя файла</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.fileName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BpmnList;
