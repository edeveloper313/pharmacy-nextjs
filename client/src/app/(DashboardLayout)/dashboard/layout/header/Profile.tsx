"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Stack,
  Autocomplete,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";

import {
  IconUser,
  IconDatabase,
  IconPackage,
  IconUsers,
  IconX,
  IconDeviceFloppy,
} from "@tabler/icons-react";

// --------------------------------------------------
// LOCAL STORAGE KEYS
// --------------------------------------------------

export const GENERIC_STORAGE_KEY = "dashboard_generics";
export const CUSTOMER_TYPE_STORAGE_KEY = "dashboard_customer_types";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type Generic = {
  id: string;
  name: string;
};

export type CustomerType = {
  id: string;
  name: string;
};

// --------------------------------------------------
// STORAGE HELPER
// --------------------------------------------------

export function getStoredData<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(key);

    if (!data) return [];

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("LocalStorage read error:", error);
    return [];
  }
}

// --------------------------------------------------
// PROFILE COMPONENT
// --------------------------------------------------

const Profile = () => {
  // Profile dropdown
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);

  // Modal
  const [openModal, setOpenModal] = useState(false);

  // Active form
  const [activeForm, setActiveForm] = useState<"generic" | "customer">(
    "generic",
  );

  // Records
  const [generics, setGenerics] = useState<Generic[]>([]);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);

  // Generic form
  const [genericId, setGenericId] = useState("");
  const [genericName, setGenericName] = useState("");

  // Customer type form
  const [customerTypeId, setCustomerTypeId] = useState("");
  const [customerTypeName, setCustomerTypeName] = useState("");

  // Notifications
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --------------------------------------------------
  // LOAD LOCAL STORAGE
  // --------------------------------------------------

  useEffect(() => {
    const loadData = () => {
      setGenerics(getStoredData<Generic>(GENERIC_STORAGE_KEY));

      setCustomerTypes(getStoredData<CustomerType>(CUSTOMER_TYPE_STORAGE_KEY));
    };

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("dashboard-lookups-updated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("dashboard-lookups-updated", loadData);
    };
  }, []);

  // --------------------------------------------------
  // PROFILE MENU
  // --------------------------------------------------

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // --------------------------------------------------
  // MODAL
  // --------------------------------------------------

  const handleOpenModal = () => {
    setOpenModal(true);
    handleClose2();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNotice(null);
  };

  // --------------------------------------------------
  // STORAGE SAVE HELPER
  // --------------------------------------------------

  const saveToStorage = <T,>(key: string, data: T[]): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));

      // Notify other components in the application
      window.dispatchEvent(new Event("dashboard-lookups-updated"));

      return true;
    } catch (error) {
      console.error("LocalStorage save error:", error);

      setNotice({
        type: "error",
        text: "Unable to save data. Please check browser storage.",
      });

      return false;
    }
  };

  // --------------------------------------------------
  // SAVE GENERIC
  // --------------------------------------------------

  const handleSaveGeneric = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = genericId.trim();
    const name = genericName.trim();

    if (!id || !name) {
      setNotice({
        type: "error",
        text: "Please enter Generic ID and Generic Name.",
      });
      return;
    }

    const duplicateId = generics.some(
      (item) => item.id.toLowerCase() === id.toLowerCase(),
    );

    const duplicateName = generics.some(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicateId) {
      setNotice({
        type: "error",
        text: "This Generic ID already exists.",
      });
      return;
    }

    if (duplicateName) {
      setNotice({
        type: "error",
        text: "This Generic Name already exists.",
      });
      return;
    }

    const updatedData = [...generics, { id, name }];

    if (!saveToStorage(GENERIC_STORAGE_KEY, updatedData)) return;

    setGenerics(updatedData);

    setGenericId("");
    setGenericName("");

    setNotice({
      type: "success",
      text: "Generic saved successfully!",
    });
  };

  // --------------------------------------------------
  // SAVE CUSTOMER TYPE
  // --------------------------------------------------

  const handleSaveCustomerType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = customerTypeId.trim();
    const name = customerTypeName.trim();

    if (!id || !name) {
      setNotice({
        type: "error",
        text: "Please enter Customer Type ID and Name.",
      });
      return;
    }

    const duplicateId = customerTypes.some(
      (item) => item.id.toLowerCase() === id.toLowerCase(),
    );

    const duplicateName = customerTypes.some(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicateId) {
      setNotice({
        type: "error",
        text: "This Customer Type ID already exists.",
      });
      return;
    }

    if (duplicateName) {
      setNotice({
        type: "error",
        text: "This Customer Type already exists.",
      });
      return;
    }

    const updatedData = [...customerTypes, { id, name }];

    if (!saveToStorage(CUSTOMER_TYPE_STORAGE_KEY, updatedData)) return;

    setCustomerTypes(updatedData);

    setCustomerTypeId("");
    setCustomerTypeName("");

    setNotice({
      type: "success",
      text: "Customer Type saved successfully!",
    });
  };

  // --------------------------------------------------
  // SHARED STYLES
  // --------------------------------------------------

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "#fff",
    },
  };

  const primaryButtonSx = {
    bgcolor: "#2563eb",
    borderRadius: 2,
    textTransform: "none" as const,
    boxShadow: "none",
    px: 2.5,
    "&:hover": {
      bgcolor: "#1d4ed8",
      boxShadow: "none",
    },
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 1.5 },
      }}
    >
      {/* MANAGE DATA BUTTON */}

      <Button
        variant="outlined"
        size="small"
        startIcon={<IconDatabase size={18} />}
        onClick={handleOpenModal}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          display: { xs: "none", sm: "inline-flex" },
        }}
      >
        Manage Data
      </Button>

      {/* MOBILE BUTTON */}

      <Tooltip title="Manage Data">
        <IconButton
          onClick={handleOpenModal}
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            color: "primary.main",
          }}
        >
          <IconDatabase size={22} />
        </IconButton>
      </Tooltip>

      {/* PROFILE BUTTON */}

      <IconButton
        size="large"
        aria-label="Profile menu"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        sx={{
          ...(anchorEl2 && {
            color: "primary.main",
          }),
        }}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

      {/* PROFILE DROPDOWN */}

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem
          component={Link}
          href="/dashboard/profile"
          onClick={handleClose2}
        >
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <Box mt={1} py={1} px={2}>
          <Button
            href="/authentication/sign-in"
            variant="outlined"
            color="primary"
            component={Link}
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>

      {/* ==========================================
          MANAGE DATA MODAL
      ========================================== */}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        aria-labelledby="manage-data-title"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            width: "100%",
            m: 2,
          },
        }}
      >
        {/* MODAL HEADER */}

        <DialogTitle id="manage-data-title" sx={{ pb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={800} fontSize={19} color="#1e293b">
                Manage Data
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Create and manage your master records.
              </Typography>
            </Box>

            <IconButton
              onClick={handleCloseModal}
              size="small"
              aria-label="Close modal"
            >
              <IconX size={21} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {/* FORM SELECTION BUTTONS */}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mb={3}>
            <Button
              fullWidth
              variant={activeForm === "generic" ? "contained" : "outlined"}
              startIcon={<IconPackage size={19} />}
              onClick={() => {
                setActiveForm("generic");
                setNotice(null);
              }}
              sx={
                activeForm === "generic"
                  ? primaryButtonSx
                  : {
                      borderRadius: 2,
                      textTransform: "none",
                    }
              }
            >
              Create Generic
            </Button>

            <Button
              fullWidth
              variant={activeForm === "customer" ? "contained" : "outlined"}
              startIcon={<IconUsers size={19} />}
              onClick={() => {
                setActiveForm("customer");
                setNotice(null);
              }}
              sx={
                activeForm === "customer"
                  ? primaryButtonSx
                  : {
                      borderRadius: 2,
                      textTransform: "none",
                    }
              }
            >
              Create Customer Type
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* =====================================
              GENERIC FORM
          ===================================== */}

          {activeForm === "generic" && (
            <Box
              component="form"
              id="generic-form"
              onSubmit={handleSaveGeneric}
            >
              <Stack spacing={2.5}>
                <Box>
                  <Typography fontWeight={700} color="#2563eb" mb={0.5}>
                    Generic Information
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Enter the generic details below.
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Generic ID"
                  placeholder="e.g. GEN-001"
                  value={genericId}
                  onChange={(e) => setGenericId(e.target.value)}
                  sx={fieldSx}
                />

                <Autocomplete
                  freeSolo
                  fullWidth
                  options={generics.map((item) => item.name)}
                  value={genericName}
                  onChange={(_, value) =>
                    setGenericName(typeof value === "string" ? value : "")
                  }
                  onInputChange={(_, value) => setGenericName(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      label="Generic Name"
                      placeholder="Search or enter generic name..."
                      helperText={
                        generics.length
                          ? `${generics.length} existing generics available`
                          : "Enter a new generic name"
                      }
                      sx={fieldSx}
                    />
                  )}
                />

                <Divider />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Typography variant="caption" color="text.secondary">
                    Total Generics: {generics.length}
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<IconDeviceFloppy size={18} />}
                    sx={primaryButtonSx}
                  >
                    Save Generic
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}

          {/* =====================================
              CUSTOMER TYPE FORM
          ===================================== */}

          {activeForm === "customer" && (
            <Box
              component="form"
              id="customer-type-form"
              onSubmit={handleSaveCustomerType}
            >
              <Stack spacing={2.5}>
                <Box>
                  <Typography fontWeight={700} color="#2563eb" mb={0.5}>
                    Customer Type Information
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Enter the customer type details below.
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Customer Type ID"
                  placeholder="e.g. CT-001"
                  value={customerTypeId}
                  onChange={(e) => setCustomerTypeId(e.target.value)}
                  sx={fieldSx}
                />

                <Autocomplete
                  freeSolo
                  fullWidth
                  options={customerTypes.map((item) => item.name)}
                  value={customerTypeName}
                  onChange={(_, value) =>
                    setCustomerTypeName(typeof value === "string" ? value : "")
                  }
                  onInputChange={(_, value) => setCustomerTypeName(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      label="Customer Type"
                      placeholder="Search or enter customer type..."
                      helperText={
                        customerTypes.length
                          ? `${customerTypes.length} existing customer types available`
                          : "Enter a new customer type"
                      }
                      sx={fieldSx}
                    />
                  )}
                />

                <Divider />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Typography variant="caption" color="text.secondary">
                    Total Customer Types: {customerTypes.length}
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<IconDeviceFloppy size={18} />}
                    sx={primaryButtonSx}
                  >
                    Save Customer Type
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #e8edf3",
          }}
        >
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseModal}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUCCESS / ERROR NOTIFICATION */}

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {notice ? (
          <Alert
            severity={notice.type}
            variant="filled"
            onClose={() => setNotice(null)}
            sx={{ width: "100%" }}
          >
            {notice.text}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default Profile;
