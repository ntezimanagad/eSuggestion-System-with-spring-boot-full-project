import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  Card,
  CardContent,
  Pagination,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Fab,
  InputAdornment,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Dashboard as DashboardIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Logout as LogoutIcon,
  NotificationsNone as NotificationsNoneIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
  Feedback as FeedbackIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const drawerWidth = 260;

function SuggestionType() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // State management
  const [name, setName] = useState("");
  const [info, setInfo] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [displayId, setDisplayId] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [adminInfo, setAdminInfo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInfo, setFilteredInfo] = useState([]);

  // Initialize dark mode based on system preference
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  // Create theme based on dark mode state
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: darkMode
          ? {
              mode: "dark",
              primary: {
                main: "#6366f1",
              },
              secondary: {
                main: "#f471b5",
              },
              background: {
                default: "#0f172a",
                paper: "#1e293b",
              },
              error: {
                main: "#ef4444",
              },
              warning: {
                main: "#f59e0b",
              },
              info: {
                main: "#3b82f6",
              },
              success: {
                main: "#10b981",
              },
            }
          : {
              mode: "light",
              primary: {
                main: "#4f46e5",
              },
              secondary: {
                main: "#ec4899",
              },
              background: {
                default: "#f8fafc",
                paper: "#ffffff",
              },
              error: {
                main: "#ef4444",
              },
              warning: {
                main: "#f59e0b",
              },
              info: {
                main: "#3b82f6",
              },
              success: {
                main: "#10b981",
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
                boxShadow: darkMode
                  ? "none"
                  : "0px 2px 8px rgba(0, 0, 0, 0.05)",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
              },
              root: {
                borderBottom: darkMode
                  ? "1px solid rgba(255, 255, 255, 0.06)"
                  : "1px solid rgba(0, 0, 0, 0.06)",
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: darkMode
                    ? alpha("#6366f1", 0.08)
                    : alpha("#4f46e5", 0.04),
                },
              },
            },
          },
        },
      }),
    [darkMode, prefersDarkMode]
  );

  useEffect(() => {
    fetchData();
    fetchAdminInfo();
  }, [page]);

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInfo(info);
    } else {
      const filtered = info.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInfo(filtered);
    }
  }, [info, searchQuery]);

  const fetchData = () => {
    setLoading(true);
    const apiPage = page - 1;

    axios
      .get("http://localhost:8080/api/suggestion-types/readByPage", {
        params: { page: apiPage, size },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setInfo(res.data.content);
        setTotalPage(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "error");
        setError("Failed to load suggestion types");
        setLoading(false);
      });
  };

  const fetchAdminInfo = () => {
    axios
      .get("http://localhost:8080/api/suggestions/userInfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAdminInfo(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch admin info:", error);
      });
  };

  const handleSuggestion = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a suggestion type name");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/suggestion-types/createSuggestionType",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Suggestion type created successfully!");
      setName("");
      fetchData();
    } catch (error) {
      console.log(error, "error");
      setError(error.response?.data || "Failed to create suggestion type");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a suggestion type name");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:8080/api/suggestion-types/changeSuggestionType/${displayId}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Suggestion type updated successfully!");
      setEditDialogOpen(false);
      clearForm();
      fetchData();
    } catch (error) {
      console.log(error, "error");
      setError(error.response?.data || "Failed to update suggestion type");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/suggestion-types/removeSuggestionTypeById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Suggestion type deleted successfully!");
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      console.log(error, "error");
      setError(error.response?.data || "Failed to delete suggestion type");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

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
      setLoading(false);
    }
  };

  const openEditDialog = (suggestionType) => {
    setDisplayId(suggestionType.id);
    setName(suggestionType.name);
    setSelectedType(suggestionType);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (suggestionType) => {
    setSelectedType(suggestionType);
    setDeleteDialogOpen(true);
  };

  const clearForm = () => {
    setDisplayId("");
    setName("");
    setSelectedType(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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
          onClick={() => navigate("/admin")}
          sx={{
            mb: 1,
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

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
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          button
          sx={{
            mb: 1,
            borderRadius: theme.shape.borderRadius,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText
            primary="Add Type"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => navigate("/viewfeedback")}
          sx={{
            mb: 1,
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <FeedbackIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="View Feedback" />
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
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Setting" />
        </ListItem>

        <Box
          sx={{
            mt: 3,
            mx: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Welcome, {adminInfo || "Admin"}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            You have {info.length} suggestion types configured
          </Typography>
        </Box>

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
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon color="error" />
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
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
        <CssBaseline />

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
            keepMounted: true,
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
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Box>

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
              Suggestion Types
            </Typography>
          </Box>

          {/* Add New Type Card */}
          <Card
            sx={{
              mb: 4,
              p: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Add New Suggestion Type
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="Type Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{ flexGrow: 1, minWidth: "200px" }}
                placeholder="Enter suggestion type name"
              />
              <Button
                variant="contained"
                onClick={handleSuggestion}
                startIcon={<AddIcon />}
                disabled={loading || !name.trim()}
                sx={{
                  height: "56px",
                  px: 3,
                  boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.25)",
                  "&:hover": {
                    boxShadow: "0 6px 20px 0 rgba(79, 70, 229, 0.3)",
                  },
                }}
              >
                {loading ? "Adding..." : "Add Type"}
              </Button>
            </Box>
          </Card>

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

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Search suggestion types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: "400px" }}
            />
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Table */}
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
            <Table size="medium">
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
                  {["ID", "Name", "Actions"].map((col) => (
                    <TableCell key={col} sx={{ py: 2 }}>
                      <Typography variant="subtitle2">{col}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && Array.isArray(filteredInfo) && filteredInfo.length > 0 ? (
                  filteredInfo.map((suggestion, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip
                          label={suggestion.id}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {suggestion.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => openEditDialog(suggestion)}
                            startIcon={<EditIcon />}
                            sx={{
                              boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.25)",
                              "&:hover": {
                                boxShadow: "0 6px 20px 0 rgba(79, 70, 229, 0.3)",
                              },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(suggestion)}
                            startIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : !loading ? (
                  <TableRow>
                    <TableCell colSpan={3}>
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
                        <CategoryIcon
                          sx={{ fontSize: 48, opacity: 0.2, mb: 2 }}
                        />
                        <Typography
                          align="center"
                          variant="body1"
                          fontWeight={500}
                        >
                          {searchQuery ? "No matching suggestion types found" : "No suggestion types found"}
                        </Typography>
                        <Typography
                          align="center"
                          variant="body2"
                          sx={{ mt: 1, opacity: 0.7 }}
                        >
                          {searchQuery ? "Try adjusting your search" : "Create your first suggestion type above"}
                        </Typography>
                        {searchQuery && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSearchQuery("")}
                            sx={{ mt: 3 }}
                          >
                            Clear Search
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && Array.isArray(info) && info.length > 0 && (
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

          {/* Edit Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
              },
            }}
          >
            <DialogTitle
              sx={{
                pb: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Edit Suggestion Type
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <TextField
                label="Type Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                variant="outlined"
                autoFocus
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setEditDialogOpen(false);
                  clearForm();
                }}
                startIcon={<CancelIcon />}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                startIcon={<SaveIcon />}
                variant="contained"
                disabled={loading || !name.trim()}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight={600} color="error">
                Confirm Delete
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete "{selectedType?.name}"? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(selectedType?.id)}
                variant="contained"
                color="error"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SuggestionType;