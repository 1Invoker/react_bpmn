import React from 'react';
import './BpmnDataAnalyzer.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export const Indicator = ({ locked }) => {
  const indicatorClassName = locked ? 'indicator green' : 'indicator red';

  return <div className={indicatorClassName}></div>;
};

const BpmnDataAnalyzer = ({ bpmnData }) => {
  let parsedData = [];

  try {
    parsedData = JSON.parse(bpmnData);
  } catch (error) {
    console.error('Ошибка при парсинге BPMN данных:', error);
  }

  if (!parsedData || !Array.isArray(parsedData)) {
    return <div>No BPMN data available</div>;
  }

  return (
    <TableContainer component={Paper} style={{ maxHeight: '200px', overflowY: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>XML ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Locked</TableCell>
            <TableCell>Indicator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parsedData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.id}</TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.locked ? 'true' : 'false'}</TableCell>
              <TableCell><Indicator locked={data.locked} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BpmnDataAnalyzer;
