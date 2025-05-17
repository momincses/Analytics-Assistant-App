import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const TableRenderer = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: 'center' }}
      >
        No data to display.
      </Typography>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#d6d6d6',
                  color: '#333',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  padding: '10px',
                }}
              >
                {col.replace(/_/g, ' ')}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              sx={{
                backgroundColor: i % 2 === 0 ? '#eeeeee' : '#e0e0e0',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    color: '#444',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    padding: '10px',
                  }}
                >
                  {typeof row[col] === 'number'
                    ? row[col].toLocaleString('en-IN')
                    : row[col]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableRenderer;
