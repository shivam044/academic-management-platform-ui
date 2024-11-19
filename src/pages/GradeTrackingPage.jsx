import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

function GradesPage() {
  // Sample data for demonstration
  const gradesData = [
    { subject: "Mathematics", grade: "A", comments: "Excellent performance" },
    { subject: "Physics", grade: "B+", comments: "Good understanding" },
    { subject: "Chemistry", grade: "A-", comments: "Well done" },
    { subject: "Biology", grade: "B", comments: "Satisfactory" },
    { subject: "History", grade: "A", comments: "Outstanding" },
  ];

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Grades
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Grade</strong></TableCell>
              <TableCell><strong>Comments</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gradesData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.grade}</TableCell>
                <TableCell>{row.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default GradesPage;
