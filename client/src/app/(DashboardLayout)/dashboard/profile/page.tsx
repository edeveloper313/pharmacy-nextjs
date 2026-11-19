
"use client";

import React, { useRef, useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
  AlertColor,
} from "@mui/material";

import {
  CloudUpload,
  Save,
  Visibility,
  VisibilityOff,
  PersonOutline,
  LocalPharmacyOutlined,
  LockOutlined,
  CameraAltOutlined,
  BusinessOutlined,
} from "@mui/icons-material";

import Alert from "@/app/components/Alert";


export default function ProfilePage() {
  const [showPass, setShowPass] = useState(false);

  const [profileImage, setProfileImage] = useState("/avatar.png");
  const [pharmacyLogo, setPharmacyLogo] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

const [alert, setAlert] = useState<
  { id: number; type: AlertColor; message: string } | null
>(null);

const showAlert = (type: AlertColor, message: string) => {
  setAlert({ id: Date.now(), type, message });
};
  const formRef = useRef<HTMLFormElement>(null);

  // Profile Image Upload
  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setShowError(true);
      setShowSuccess(false);
      return;
    }

    setProfileImage(URL.createObjectURL(file));
  };

  // Pharmacy Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setShowError(true);
      setShowSuccess(false);
      return;
    }

    setPharmacyLogo(URL.createObjectURL(file));
  };

  // Save Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowSuccess(false);
    setShowError(false);

    try {
      // Connect your profile update API here.
      // Example:
      // await updateProfile(formData);

      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
    }
  };

  // Reset Form
  const handleReset = () => {
    formRef.current?.reset();

    setProfileImage("/avatar.png");
    setPharmacyLogo(null);
    setShowPass(false);

    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>

      {/* ALERTS */}

{alert && (
  <Alert
    key={alert.id}          
    id={alert.id}           
    type={alert.type}
    message={alert.message}
  />
)}

      {/* PAGE HEADER */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#1e293b"
          >
            Profile & Pharmacy Details
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >
            Manage your personal information and pharmacy business details.
          </Typography>
        </Box>

        <Chip
          label="Super Admin"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      <form ref={formRef} onSubmit={handleSubmit}>

        {/* ================================= */}
        {/* SECTION 1: PERSONAL INFORMATION */}
        {/* ================================= */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e8edf3",
            borderRadius: "14px",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              mb={3}
            >
              <Avatar
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  borderRadius: "10px",
                }}
              >
                <PersonOutline />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Personal Information
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Your personal account information
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* PROFILE IMAGE */}

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              mb={3}
            >
              <Box position="relative">
                <Avatar
                  src={profileImage}
                  sx={{
                    width: 76,
                    height: 76,
                    border: "3px solid #eff6ff",
                  }}
                />

                <IconButton
                  component="label"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    bgcolor: "#2563eb",
                    color: "#fff",
                    width: 28,
                    height: 28,
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                    },
                  }}
                >
                  <CameraAltOutlined sx={{ fontSize: 16 }} />

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                  />
                </IconButton>
              </Box>

              <Box>
                <Typography fontWeight={700} variant="body1">
                  Profile Photo
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  JPG or PNG, maximum 2MB
                </Typography>

                <Button
                  component="label"
                  size="small"
                  startIcon={<CloudUpload />}
                  sx={{ mt: 0.5 }}
                >
                  Change Photo

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                  />
                </Button>
              </Box>
            </Stack>

            {/* PERSONAL FIELDS */}

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  size="small"
                  fullWidth
                  defaultValue="Faisal BARKATI"
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Username"
                  name="username"
                  size="small"
                  fullWidth
                  defaultValue="admin_pharmacy"
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  size="small"
                  fullWidth
                  defaultValue="admin@pharmacy.com"
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  size="small"
                  fullWidth
                  defaultValue="0301-2345678"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* SECTION 2: PHARMACY INFORMATION */}
        {/* ================================= */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e8edf3",
            borderRadius: "14px",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              mb={3}
            >
              <Avatar
                sx={{
                  bgcolor: "#f0fdf4",
                  color: "#16a34a",
                  borderRadius: "10px",
                }}
              >
                <LocalPharmacyOutlined />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Pharmacy Business Profile
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Business details used on printed and PDF invoices
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* PHARMACY LOGO */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                mb: 3,
                bgcolor: "#f8fafc",
                border: "1px dashed #cbd5e1",
                borderRadius: "12px",
                flexWrap: "wrap",
              }}
            >
              <Avatar
                variant="rounded"
                src={pharmacyLogo || undefined}
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "#fff",
                  color: "#94a3b8",
                  border: "1px solid #e2e8f0",
                }}
              >
                {!pharmacyLogo && <BusinessOutlined fontSize="large" />}
              </Avatar>

              <Box flex={1}>
                <Typography fontWeight={700}>
                  Pharmacy Logo
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={1}
                >
                  This logo will appear on invoices and PDF documents.
                </Typography>

                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  startIcon={<CloudUpload />}
                  sx={{
                    bgcolor: "#2563eb",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                  }}
                >
                  Upload Logo

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </Button>
              </Box>
            </Box>

            {/* PHARMACY FIELDS */}

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Pharmacy Name"
                  name="pharmacyName"
                  size="small"
                  fullWidth
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Tagline / Slogan"
                  name="tagline"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="TRN / Tax Number"
                  name="taxNumber"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Pharmacy / Drug License No."
                  name="licenseNumber"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Business Phone"
                  name="businessPhone"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="WhatsApp Number (Digital Delivery)"
                  name="whatsapp"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Business Email"
                  name="businessEmail"
                  type="email"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="City & Country"
                  name="city"
                  size="small"
                  fullWidth
                  defaultValue="Karachi, Pakistan"
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Full Shop Address"
                  name="address"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Invoice Footer Note"
                  name="invoiceNote"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="e.g., Medicines once sold cannot be returned without bill."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* SECTION 3: SECURITY */}
        {/* ================================= */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e8edf3",
            borderRadius: "14px",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              mb={3}
            >
              <Avatar
                sx={{
                  bgcolor: "#fff7ed",
                  color: "#ea580c",
                  borderRadius: "10px",
                }}
              >
                <LockOutlined />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Security & Password
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Keep your account secure
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="New Password"
                  name="newPassword"
                  type={showPass ? "text" : "password"}
                  size="small"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPass(!showPass)}
                          edge="end"
                          size="small"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* SAVE & RESET BUTTONS */}
        {/* ================================= */}

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1.5}
          flexWrap="wrap"
        >
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={handleReset}
            sx={{
              borderRadius: "9px",
              px: 3,
              textTransform: "none",
            }}
          >
            Reset
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            sx={{
              bgcolor: "#2563eb",
              borderRadius: "9px",
              px: 3,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#1d4ed8",
                boxShadow: "none",
              },
            }}
          >
            Save Changes
          </Button>
        </Stack>

      </form>
    </Box>
  );
}
