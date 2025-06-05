import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
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
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Avatar,
  CardHeader,
  LinearProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  Feedback as FeedbackIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const drawerWidth = 260;

function Setting() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // State management
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ password: '', cpassword: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState("");
  const [update, setUpdate] = useState({ name: "", email: "" });
  const [adminInfo, setAdminInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: Profile, 1: Password Reset

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
        },
      }),
    [darkMode, prefersDarkMode]
  );

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, step]);

  useEffect(() => {
    fetchAdminInfo();
    getEmp();
  }, []);

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

  const getEmp = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/suggestions/getEmpInfo", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInfo(res.data.id);
      setUpdate({ name: res.data.name || "", email: res.data.email || "" });
    } catch (error) {
      console.error(error);
    }
  };

  const sendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/employees/reset', { email }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess("OTP sent successfully to your email");
      setError('');
      setStep(2);
      setTimer(60);
    } catch (err) {
      setError(err.response?.data || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/employees/validatePassword', { email, otp }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess("OTP verified successfully");
      setError('');
      setStep(3);
    } catch (err) {
      setError(err.response?.data || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwords.password !== passwords.cpassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwords.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put('http://localhost:8080/api/employees/updatePassword', {
        email,
        password: passwords.password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess("Password updated successfully! Please login again.");
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (!update.name.trim() || !update.email.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:8080/api/employees/changeEmployee/${info}`, update, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess("Profile updated successfully!");
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    sendOtp();
  };

  const handleLogout = async () => {
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
          onClick={() => navigate("/suggestiontype")}
          sx={{
            mb: 1,
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <CategoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Add Type" />
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
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
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
            Manage your account settings
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

  const steps = ['Enter Email', 'Verify OTP', 'Update Password'];

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
              Settings
            </Typography>
          </Box>

          {/* Tab Navigation */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                width: "fit-content",
              }}
            >
              <Button
                variant={activeTab === 0 ? "contained" : "text"}
                onClick={() => setActiveTab(0)}
                startIcon={<PersonIcon />}
                sx={{ borderRadius: 1.5 }}
              >
                Profile Settings
              </Button>
              <Button
                variant={activeTab === 1 ? "contained" : "text"}
                onClick={() => setActiveTab(1)}
                startIcon={<SecurityIcon />}
                sx={{ borderRadius: 1.5 }}
              >
                Password Reset
              </Button>
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

          <Grid container spacing={4}>
            {/* Profile Settings */}
            {activeTab === 0 && (
              <Grid item xs={12} md={8}>
                <Card
                  sx={{
                    p: 4,
                    bgcolor: alpha(theme.palette.background.paper, darkMode ? 0.7 : 1),
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <AccountCircleIcon />
                      </Avatar>
                    }
                    title="Profile Information"
                    subheader="Update your account details"
                    sx={{ pb: 3 }}
                  />
                  
                  <Box component="form" onSubmit={updateUser}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label="Full Name"
                          value={update.name}
                          onChange={(e) => setUpdate({ ...update, name: e.target.value })}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email Address"
                          type="email"
                          value={update.email}
                          onChange={(e) => setUpdate({ ...update, email: e.target.value })}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          startIcon={<SaveIcon />}
                          disabled={loading}
                          sx={{
                            px: 4,
                            py: 1.5,
                            boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.25)",
                            "&:hover": {
                              boxShadow: "0 6px 20px 0 rgba(79, 70, 229, 0.3)",
                            },
                          }}
                        >
                          {loading ? "Updating..." : "Update Profile"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            )}

            {/* Password Reset */}
            {activeTab === 1 && (
              <Grid item xs={12} md={8}>
                <Card
                  sx={{
                    p: 4,
                    bgcolor: alpha(theme.palette.background.paper, darkMode ? 0.7 : 1),
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                        <LockIcon />
                      </Avatar>
                    }
                    title="Password Reset"
                    subheader="Reset your account password"
                    sx={{ pb: 3 }}
                  />

                  {/* Stepper */}
                  <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  {loading && <LinearProgress sx={{ mb: 3 }} />}

                  {/* Step 1: Email */}
                  {step === 1 && (
                    <Box>
                      <TextField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                        InputProps={{
                          startAdornment: (
                            <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                          ),
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={sendOtp}
                        disabled={loading || !email.trim()}
                        startIcon={<SendIcon />}
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.5,
                          boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.25)",
                          "&:hover": {
                            boxShadow: "0 6px 20px 0 rgba(79, 70, 229, 0.3)",
                          },
                        }}
                      >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                      </Button>
                    </Box>
                  )}

                  {/* Step 2: OTP Verification */}
                  {step === 2 && (
                    <Box>
                      <TextField
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                        inputProps={{ maxLength: 6 }}
                      />
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
                        <Button
                          variant="contained"
                          onClick={validateOtp}
                          disabled={loading || !otp.trim()}
                          size="large"
                          sx={{
                            px: 4,
                            py: 1.5,
                            boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.25)",
                            "&:hover": {
                              boxShadow: "0 6px 20px 0 rgba(79, 70, 229, 0.3)",
                            },
                          }}
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                        {timer > 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Resend OTP in {timer} seconds
                          </Typography>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={handleResendOtp}
                            startIcon={<RefreshIcon />}
                          >
                            Resend OTP
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Step 3: Password Update */}
                  {step === 3 && (
                    <Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            value={passwords.password}
                            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <LockIcon sx={{ mr: 1, color: 'action.active' }} />
                              ),
                              endAdornment: (
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwords.cpassword}
                            onChange={(e) => setPasswords({ ...passwords, cpassword: e.target.value })}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <LockIcon sx={{ mr: 1, color: 'action.active' }} />
                              ),
                              endAdornment: (
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            onClick={updatePassword}
                            disabled={loading || !passwords.password || !passwords.cpassword}
                            startIcon={<SaveIcon />}
                            size="large"
                            sx={{
                              px: 4,
                              py: 1.5,
                              boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.25)",
                              "&:hover": {
                                boxShadow: "0 6px 20px 0 rgba(79, 70, 229, 0.3)",
                              },
                            }}
                          >
                            {loading ? 'Updating...' : 'Update Password'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Setting;