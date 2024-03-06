import React from 'react';
import { useSelector } from 'react-redux';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { selectFiles } from '../Redux/fileSlice';

const BpmnList = () => {

  const files = useSelector(selectFiles);

  if (!files || !Array.isArray(files)) {
      return <div>No data available</div>;
  }

  const sortedData = files.sort((a, b) => {
      return a.fileName.localeCompare(b.fileName);
  });

  return (
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
  );
}

export default BpmnList;
