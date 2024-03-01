import React from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const BpmnList = ({ BpmnData }) => {
    if (!BpmnData || !Array.isArray(BpmnData)) {
        return <div>No data available</div>;
    }

    const sortedData = BpmnData.sort((a, b) => {
        return a.name.localeCompare(b.name);
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
                            <TableCell>{file.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default BpmnList;