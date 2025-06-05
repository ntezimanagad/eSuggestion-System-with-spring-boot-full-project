import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CardContent } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  InputAdornment,
  Avatar,
  Chip,
  Card,
  CssBaseline,
  Pagination,
  Grid
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Home,
  Add,
  Logout,
  Search,
  Edit,
  Delete,
  NotificationsNone,
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";


const drawerWidth = 260;

function UserDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mobileOpen, setMobileOpen] = useState(false);

  // State management
  const [info, setInfo] = useState([]);
  const [getInfos, setGetInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employee, setEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [totalSuggestion, setTotalSuggestion] = useState(0);
  const [mySuggestionCount, setMySuggestionCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Search filters
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchComments, setSearchComments] = useState("");

  // Initialize dark mode based on system preference
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const suggestionStats = [
  { name: "Total", value: totalSuggestion },
  { name: "Approved", value: approvedCount },
  { name: "Rejected", value: rejectedCount },
  { name: "My Suggestions", value: mySuggestionCount },
];

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#8884d8"];


  // Create modern theme with the provided color palette
  const theme = createTheme({
    palette: darkMode
      ? {
          mode: "dark",
          primary: {
            main: "#6366f1", // Lighter indigo for dark mode
          },
          secondary: {
            main: "#f471b5", // Lighter pink for dark mode
          },
          background: {
            default: "#0f172a", // Dark blue-gray
            paper: "#1e293b", // Lighter blue-gray
          },
          error: {
            main: "#ef4444", // Red
          },
          warning: {
            main: "#f59e0b", // Amber
          },
          info: {
            main: "#3b82f6", // Blue
          },
          success: {
            main: "#10b981", // Green
          },
        }
      : {
          mode: "light",
          primary: {
            main: "#4f46e5", // Modern indigo
          },
          secondary: {
            main: "#ec4899", // Modern pink
          },
          background: {
            default: "#f8fafc", // Light gray
            paper: "#ffffff", // White
          },
          error: {
            main: "#ef4444", // Red
          },
          warning: {
            main: "#f59e0b", // Amber
          },
          info: {
            main: "#3b82f6", // Blue
          },
          success: {
            main: "#10b981", // Green
          },
        },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            padding: "8px 16px",
          },
          containedPrimary: {
            "&:hover": {
              boxShadow: `0 4px 14px 0 ${alpha("#4f46e5", 0.25)}`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: darkMode ? "none" : "0px 2px 8px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  });

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      if (token) {
        await axios.post(
          "http://localhost:8080/api/employees/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Fetch data with pagination
  const fetchData = () => {
    setLoading(true);
    // API page is 0-indexed, but UI is 1-indexed
    const apiPage = page - 1;

    axios
      .get("http://localhost:8080/api/suggestions/getInfo", {
        params: { page: apiPage, size },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGetInfo(res.data.content);
        setFilteredData(res.data.content);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load suggestions data");
        setLoading(false);
      });
  };

  // Data fetching effects
  useEffect(() => {
    const handleUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/suggestions/userInfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInfo(response.data);
      } catch (error) {
        console.log(error, "error");
      }
    };

    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/suggestions/getEmpInfo",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEmployee(response.data.id);
      } catch (error) {
        console.error(error.response?.data || "Error fetching employee");
      }
    };
    const fetchSummary = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [totalRes, myRes, statusCountRes] = await Promise.all([
          axios.get("http://localhost:8080/api/suggestions/countAll", { headers }),
          axios.get("http://localhost:8080/api/suggestions/count", { headers }),
          axios.get("http://localhost:8080/api/suggestions/status-count", {
            headers,
          }),
        ]);

        setTotalSuggestion(totalRes.data);
        setMySuggestionCount(myRes.data.totalMySuggestion);
        setApprovedCount(statusCountRes.data.approved);
        setRejectedCount(statusCountRes.data.rejected);
      } catch (error) {
        console.error("Failed to fetch summary stats", error);
      }
    };

    fetchSummary();

    handleUser();
    fetchData();
    fetchEmployee();
  }, [token, page, size]); // Re-fetch when page or size changes

  // Delete suggestion handler
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8080/api/suggestions/removeSuggestionById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(response.data);
      setError("");
      // Refresh data after deletion
      fetchData();
    } catch (error) {
      setError(error.response?.data || "Failed to delete suggestion");
    } finally {
      setLoading(false);
    }
  };

  // Global search effect
  useEffect(() => {
  const global = searchTerm.toLowerCase();

  const filtered = getInfos.filter((s) => {
    const title = s.title?.toLowerCase() || "";
    const description = s.description?.toLowerCase() || "";
    const status = s.status?.toLowerCase() || "";
    const type = s.suggestionTypeId?.name?.toLowerCase() || "";
    const comments = s.comments?.toLowerCase() || "";

    const globalMatch =
      title.includes(global) ||
      description.includes(global) ||
      status.includes(global) ||
      type.includes(global) ||
      comments.includes(global);

    const columnMatch =
      title.includes(searchTitle.toLowerCase()) &&
      description.includes(searchDescription.toLowerCase()) &&
      status.includes(searchStatus.toLowerCase()) &&
      type.includes(searchType.toLowerCase()) &&
      comments.includes(searchComments.toLowerCase());

    return globalMatch && columnMatch;
  });

  setFilteredData(filtered);
}, [
  getInfos,
  searchTerm,
  searchTitle,
  searchDescription,
  searchStatus,
  searchType,
  searchComments,
]);


  // Filtered suggestions based on search criteria
  useEffect(() => {
    const filtered = getInfos.filter(
      (s) =>
        (s.title?.toLowerCase() || "").includes(searchTitle.toLowerCase()) &&
        (s.description?.toLowerCase() || "").includes(
          searchDescription.toLowerCase()
        ) &&
        (s.status?.toLowerCase() || "").includes(searchStatus.toLowerCase()) &&
        (s.suggestionTypeId?.name?.toLowerCase() || "").includes(
          searchType.toLowerCase()
        ) &&
        (s.comments?.toLowerCase() || "").includes(searchComments.toLowerCase())
    );
    setFilteredData(filtered);
  }, [
    getInfos,
    searchTitle,
    searchDescription,
    searchStatus,
    searchType,
    searchComments,
  ]);

  // Status chip color helper
  const getStatusColor = (status) => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("approved") || statusLower.includes("completed"))
      return "success";
    if (statusLower.includes("pending") || statusLower.includes("review"))
      return "warning";
    if (statusLower.includes("rejected") || statusLower.includes("denied"))
      return "error";
    return "info";
  };

  // Handle drawer toggle for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar content
  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: darkMode
          ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(
              theme.palette.primary.main,
              0.05
            )})`
          : `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(
              theme.palette.primary.main,
              0.03
            )})`,
      }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Suggestion System
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, px: 2 }}>
        <ListItem
          button
          onClick={() => navigate("/")}
          sx={{
            mb: 1,
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Home color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          button
          onClick={() =>
            navigate("/add-suggestion", { state: { employeeId: employee } })
          }
          sx={{
            mb: 1,
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Add color="primary" />
          </ListItemIcon>
          <ListItemText primary="Add Suggestion" />
        </ListItem>
         <ListItem
          button
          onClick={() => navigate("/setting")}
          sx={{
            mb: 1,
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Setting" />
        </ListItem>
        {info && <Typography sx={{ px: 2, py: 1 }}>Welcome {info}</Typography>}
        <Divider sx={{ my: 2, opacity: 0.1 }} />

        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Logout color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ color: theme.palette.error.main }}
          />
        </ListItem>
      </List>

      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
            },
          }}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            backgroundImage: `radial-gradient(circle at top right, ${alpha(
              theme.palette.primary.main,
              0.03
            )}, transparent 400px), 
                            radial-gradient(circle at bottom left, ${alpha(
                              theme.palette.secondary.main,
                              0.03
                            )}, transparent 300px)`,
            backgroundSize: "100% 100%",
            backgroundAttachment: "fixed",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Total Suggestion in System
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {totalSuggestion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      My Suggestion Submitted
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {mySuggestionCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Approved Suggestions
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {approvedCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Rejected Suggestions
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {rejectedCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ my: 4 }}>
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <Typography variant="h6" gutterBottom>
        Suggestion Distribution (Pie Chart)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={suggestionStats}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {suggestionStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Grid>

    <Grid item xs={12} md={6}>
      <Typography variant="h6" gutterBottom>
        Suggestion Overview (Bar Chart)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={suggestionStats}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Grid>
  </Grid>
</Box>

          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                background: darkMode
                  ? `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  : "inherit",
                WebkitBackgroundClip: darkMode ? "text" : "inherit",
                WebkitTextFillColor: darkMode ? "transparent" : "inherit",
                fontWeight: 700,
                mb: 0,
              }}
            >
              Your Suggestions
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() =>
                  navigate("/add-suggestion", {
                    state: { employeeId: employee },
                  })
                }
                sx={{
                  px: 3,
                  boxShadow: `0 4px 14px 0 ${alpha(
                    theme.palette.primary.main,
                    0.25
                  )}`,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                New Suggestion
              </Button>

              <IconButton
                sx={{ display: { xs: "flex", sm: "none" } }}
                onClick={() =>
                  navigate("/add-suggestion", {
                    state: { employeeId: employee },
                  })
                }
              >
                <Add />
              </IconButton>

              <TextField
                placeholder="Search suggestions..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 240 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    "& fieldset": {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Status messages */}
          {success && (
            <Card
              sx={{
                mb: 3,
                p: 2,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderLeft: `4px solid ${theme.palette.success.main}`,
              }}
            >
              <Typography color="success.main">{success}</Typography>
            </Card>
          )}

          {error && (
            <Card
              sx={{
                mb: 3,
                p: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                borderLeft: `4px solid ${theme.palette.error.main}`,
              }}
            >
              <Typography color="error.main">{error}</Typography>
            </Card>
          )}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Suggestions Table */}
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              overflow: "hidden",
              borderRadius: 0,
              boxShadow: theme.shadows[1],
              bgcolor: alpha(
                theme.palette.background.paper,
                darkMode ? 0.7 : 1
              ),
              backdropFilter: "blur(8px)",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.1
                  )}`,
                }}
              >
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Search Title"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      variant="standard"
                      fullWidth
                      sx={{
                        "& .MuiInput-underline:before": {
                          borderBottomColor: alpha(theme.palette.divider, 0.3),
                        },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottomColor: theme.palette.primary.main,
                          },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Search Description"
                      value={searchDescription}
                      onChange={(e) => setSearchDescription(e.target.value)}
                      variant="standard"
                      fullWidth
                      sx={{
                        "& .MuiInput-underline:before": {
                          borderBottomColor: alpha(theme.palette.divider, 0.3),
                        },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottomColor: theme.palette.primary.main,
                          },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Search Status"
                      value={searchStatus}
                      onChange={(e) => setSearchStatus(e.target.value)}
                      variant="standard"
                      fullWidth
                      sx={{
                        "& .MuiInput-underline:before": {
                          borderBottomColor: alpha(theme.palette.divider, 0.3),
                        },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottomColor: theme.palette.primary.main,
                          },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Search Type"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      variant="standard"
                      fullWidth
                      sx={{
                        "& .MuiInput-underline:before": {
                          borderBottomColor: alpha(theme.palette.divider, 0.3),
                        },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottomColor: theme.palette.primary.main,
                          },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Search Comments"
                      value={searchComments}
                      onChange={(e) => setSearchComments(e.target.value)}
                      variant="standard"
                      fullWidth
                      sx={{
                        "& .MuiInput-underline:before": {
                          borderBottomColor: alpha(theme.palette.divider, 0.3),
                        },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottomColor: theme.palette.primary.main,
                          },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && filteredData.length > 0 ? (
                  filteredData.map((info) => (
                    <TableRow key={info.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {info.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {info.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={info.status || "Unknown"}
                          size="small"
                          color={getStatusColor(info.status)}
                          variant={darkMode ? "outlined" : "filled"}
                          sx={{
                            fontWeight: 500,
                            opacity: darkMode ? 0.8 : 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {info.suggestionTypeId?.name ||
                            info.suggestionTypeId ||
                            "None"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {info.comments || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate(`/update-suggestion/${info.id}`, {
                                state: {
                                  id: info.id,
                                  title: info.title,
                                  description: info.description,
                                  status: info.status,
                                  suggestionTypeId:
                                    info.suggestionType?.id || "",
                                  employeeId: info.employee?.id || employee,
                                },
                              })
                            }
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(info.id)}
                            sx={{
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 6,
                          opacity: 0.7,
                        }}
                      >
                        <NotificationsNone
                          sx={{ fontSize: 48, opacity: 0.2, mb: 2 }}
                        />
                        <Typography
                          align="center"
                          variant="body1"
                          fontWeight={500}
                        >
                          No suggestions found
                        </Typography>
                        <Typography
                          align="center"
                          variant="body2"
                          sx={{ mt: 1, opacity: 0.7 }}
                        >
                          Try adjusting your search or create a new suggestion
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Add />}
                          onClick={() =>
                            navigate("/add-suggestion", {
                              state: { employeeId: employee },
                            })
                          }
                          sx={{ mt: 3 }}
                        >
                          Add New Suggestion
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && filteredData.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      fontWeight: "bold",
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default UserDashboard;
