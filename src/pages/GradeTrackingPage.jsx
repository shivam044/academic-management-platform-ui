import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const backendUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchSubjectsAndAssignmentsAndGrades();
  }, []);

  const fetchSubjectsAndAssignmentsAndGrades = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [subjectsResponse, assignmentsResponse, gradesResponse] =
        await Promise.all([
          axios.get(`${backendUrl}/api/subjects`, config),
          axios.get(`${backendUrl}/api/assignments`, config),
          axios.get(`${backendUrl}/api/grades`, config),
        ]);

      const updatedSubjects = subjectsResponse.data.map((subject) => {
        const filteredAssignments = assignmentsResponse.data.filter(
          (assignment) => assignment.s_id && assignment.s_id._id === subject._id
        );

        const gradesForSubject = gradesResponse.data.filter(
          (grade) => grade.s_id && grade.s_id._id === subject._id
        );

        const totalAchieved = gradesForSubject.reduce(
          (sum, grade) => sum + grade.grade,
          0
        );
        const totalOutOf = gradesForSubject.reduce(
          (sum, grade) => sum + grade.outOf,
          0
        );
        const totalLose =
          gradesForSubject.reduce((sum, grade) => sum + grade.outOf, 0) -
          totalAchieved;

        return {
          ...subject,
          totalAssignments: filteredAssignments.length,
          totalAchieved: totalAchieved,
          totalLose: totalLose,
          totalOutOf: totalOutOf,
        };
      });

      setSubjects(updatedSubjects);

      const updatedAssignmentList = assignmentsResponse.data.map(
        (assignment) => {
          const grade = gradesResponse.data.find(
            (grade) => grade.a_id._id === assignment._id
          );

          if (!grade) {
            return {
              ...assignment,
            };
          }

          return {
            ...assignment,
            grade,
          };
        }
      );

      setAssignmentsList(updatedAssignmentList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsForSubject = (subjectId) => {
    const filteredAssignments = assignmentsList.filter(
      (assignment) => assignment.s_id && assignment.s_id._id === subjectId
    );

    return filteredAssignments;
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Grades
      </Typography>

      <Box
        sx={{
          padding: "20px",
          columnCount: { md: 1, lg: 2, xl: 3 },
          columnGap: { md: "20px", lg: "40px" },
        }}
      >
        {subjects.map((subject, index) => (
          <Box
            key={subject.id || index}
            sx={{
              marginBottom: "40px",
              breakInside: "avoid",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "40px",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: "var(--normal)" }}>
                {subject.subjectTitle}
              </Typography>
              <Box
                sx={{
                  fontSize: "var(--small)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Box
                  sx={{
                    height: "8px",
                    width: "20px",
                    background: "#f4c430",
                    borderRadius: "5px",
                  }}
                />
                <p></p>Target: <b>{subject.targetGrade}%</b>
              </Box>
            </Box>

            <Box
              sx={{
                overflow: "hidden",
                marginY: 2,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: 40,
                  width: "100%",
                  backgroundColor: "#e7f1e8",
                  overflow: "hidden",
                  borderRadius: "5px",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: `${subject.totalOutOf}%`,
                    backgroundColor: "#c6e5ff",
                    transition: "0.3s",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    height: "10px",
                    width: `${subject.targetGrade}%`,
                    backgroundColor: "#f4c430",
                    zIndex: 10,
                    transition: "0.3s",
                    borderRadius: "10px",
                    top: "50%",
                    transform: "translate(0, -50%)",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: `${subject.totalAchieved}%`,
                    backgroundColor: "#77dd76",
                    transition: "0.3s",
                    zIndex: 10,
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: `${subject.totalLose}%`,
                    backgroundColor: "#ff6962",
                    right: 0,
                    transition: "0.3s",
                  }}
                />
              </Box>
            </Box>

            <Accordion
              sx={{
                boxShadow: "none",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    alignSelf: "flex-end", // Aligns the icon to the bottom
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: { md: "10px", lg: "20px" },
                      width: "100%",
                      marginBottom: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ fontSize: "var(--small)", width: "100%" }}
                    >
                      <Box
                        sx={{
                          height: "8px",
                          width: "20px",
                          background: "#77dd76",
                          borderRadius: "5px",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                      />
                      Achieved <b>{subject.totalAchieved}%</b>
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontSize: "var(--small)",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          height: "8px",
                          width: "20px",
                          background: "#c6e5ff",
                          borderRadius: "5px",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                      />
                      Done <b>{subject.totalLose}%</b>
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontSize: "var(--small)",
                        textAlign: "right",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          height: "8px",
                          width: "20px",
                          background: "#ff6962",
                          borderRadius: "5px",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                      />
                      Lose <b>{subject.totalLose}%</b>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      marginTop: 1,
                      color: "#808080",
                    }}
                  >
                    <b
                      style={{
                        color: "#000",
                      }}
                    >
                      {subject.totalAssignments}
                    </b>{" "}
                    Assignments
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {getAssignmentsForSubject(subject._id).length > 0 ? (
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Due Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Achieved</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getAssignmentsForSubject(subject._id).map(
                        (assignment) => (
                          <TableRow key={assignment._id}>
                            <TableCell>{assignment.name}</TableCell>
                            <TableCell>
                              {assignment.due_date
                                ? new Date(
                                    assignment.due_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {assignment.grade ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <span>
                                    {assignment.grade.grade}/
                                    {assignment.grade.outOf}
                                  </span>
                                  <LinearProgress
                                    variant="determinate"
                                    value={
                                      (assignment.grade.grade * 100) /
                                      assignment.grade.outOf
                                    }
                                    sx={{
                                      height: 20,
                                      width: "80px",
                                      borderRadius: "5px",
                                      backgroundColor: "#ff6962",
                                      "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#77dd76",
                                      },
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Not Graded
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    aria-label="Add grade"
                                    onClick={() => {
                                      
                                    }}
                                    sx={{
                                      backgroundColor: "#e7f1e8",
                                      "&:hover": { backgroundColor: "#d5e8d4" },
                                    }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography>
                    No assignments for {subject.subjectTitle}.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default GradesPage;
