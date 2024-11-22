import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

function GradesPage() {
  const [gradesList, setGradesList] = useState([]); // List of grades
  const [selectedGrade, setSelectedGrade] = useState(null); // Single grade for editing
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const backendUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchUserGrades();
  }, []);

  const fetchUserGrades = async () => {
    try {
      if (!token) throw new Error("No token found");

      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `${backendUrl}/api/grades/user/${userId}`,
        config
      );
      setGradesList(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (grade = null) => {
    setSelectedGrade(grade || { grade: "", comments: "", notes: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGrade(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedGrade((prevGrade) => ({ ...prevGrade, [name]: value }));
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Grades
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Grade</strong></TableCell>
              <TableCell><strong>Comments</strong></TableCell>
              <TableCell><strong>Notes</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gradesList.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.grade}</TableCell>
                <TableCell>{row.comments}</TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default GradesPage;
