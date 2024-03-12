import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { selectFiles } from '../Redux/fileSlice';

const BpmnList = () => {
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);

  useEffect(() => {
    dispatch(selectFiles());
  }, [dispatch]);

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
