"use client";

import React, { useMemo, useRef, useState } from "react";

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
  Stack,
  Divider,
  Tooltip,
  AlertColor,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import {
  Save,
  AddBusinessOutlined,
  BusinessOutlined,
  LocationOnOutlined,
  PhoneOutlined,
  WhatsApp,
  BadgeOutlined,
  CheckCircle,
  DeleteOutline,
  RestartAlt,
  EditOutlined,
  ContentCopyOutlined,
  Check,
  Close,
} from "@mui/icons-material";

import Alert from "@/app/components/Alert";

/* -------------------- Types -------------------- */

type CompanyProfile = {
  id: number;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyWhatsapp: string;
  companyNtn: string;
};

type FormState = {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyWhatsapp: string;
  companyNtn: string;
};

const EMPTY_FORM: FormState = {
  companyName: "",
  companyAddress: "",
  companyPhone: "",
  companyWhatsapp: "",
  companyNtn: "",
};

/* -------------------- Small helper -------------------- */

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{ color: "#94a3b8", display: "flex", "& svg": { fontSize: 16 } }}
      >
        {icon}
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
        sx={{ fontSize: 13 }}
      >
        {text || "—"}
      </Typography>
    </Stack>
  );
}

function formatOfficialDetails(p: CompanyProfile): string {
  const lines = [
    `Company Name : ${p.companyName}`,
    `Address      : ${p.companyAddress}`,
    `Phone        : ${p.companyPhone}`,
  ];
  if (p.companyWhatsapp) lines.push(`WhatsApp     : ${p.companyWhatsapp}`);
  if (p.companyNtn) lines.push(`NTN          : ${p.companyNtn}`);
  return lines.join("\n");
}

/* -------------------- Page -------------------- */

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompanyProfile | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const [alert, setAlert] = useState<{
    id: number;
    type: AlertColor;
    message: string;
  } | null>(null);

  const formCardRef = useRef<HTMLDivElement | null>(null);

  const showAlert = (type: AlertColor, message: string) => {
    setAlert({ id: Date.now(), type, message });
  };

  /* ---------- Form handlers ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof FormState]: value }));
    setErrors((prev) => ({ ...prev, [name as keyof FormState]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.companyName.trim())
      next.companyName = "Company name is required.";
    if (!form.companyAddress.trim())
      next.companyAddress = "Company address is required.";
    if (!form.companyPhone.trim())
      next.companyPhone = "Phone number is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showAlert("error", "Please fill all required fields correctly.");
      return;
    }

    const cleaned: FormState = {
      companyName: form.companyName.trim(),
      companyAddress: form.companyAddress.trim(),
      companyPhone: form.companyPhone.trim(),
      companyWhatsapp: form.companyWhatsapp.trim(),
      companyNtn: form.companyNtn.trim(),
    };

    if (editingId !== null) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...cleaned } : p)),
      );
      setEditingId(null);
      setForm(EMPTY_FORM);
      setErrors({});
      showAlert("success", "Company profile updated successfully.");
      return;
    }

    const profile: CompanyProfile = {
      id: Date.now(),
      ...cleaned,
    };

    setProfiles((prev) => [profile, ...prev]);
    if (selectedId === null) setSelectedId(profile.id);

    setForm(EMPTY_FORM);
    setErrors({});
    showAlert("success", "Company profile saved successfully.");
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
  };

  /* ---------- Grid handlers ---------- */

  const handleSelect = (id: number) => {
    if (selectedId === id) return;
    setSelectedId(id);
    const p = profiles.find((x) => x.id === id);
    if (p) showAlert("info", `"${p.companyName}" selected as active profile.`);
  };

  const handleEditStart = (p: CompanyProfile) => {
    setEditingId(p.id);
    setForm({
      companyName: p.companyName,
      companyAddress: p.companyAddress,
      companyPhone: p.companyPhone,
      companyWhatsapp: p.companyWhatsapp,
      companyNtn: p.companyNtn,
    });
    setErrors({});
    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDeleteRequest = (p: CompanyProfile) => {
    setDeleteTarget(p);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const removed = deleteTarget;

    setProfiles((prev) => prev.filter((p) => p.id !== removed.id));
    if (selectedId === removed.id) setSelectedId(null);
    if (editingId === removed.id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
      setErrors({});
    }

    setDeleteTarget(null);
    showAlert("warning", `Profile "${removed.companyName}" deleted.`);
  };

  const handleCopy = async (p: CompanyProfile) => {
    const text = formatOfficialDetails(p);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(p.id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === p.id ? null : prev));
      }, 2000);
      showAlert(
        "success",
        `"${p.companyName}" details copied in official format.`,
      );
    } catch {
      showAlert("error", "Failed to copy company details.");
    }
  };

  const selectedProfile = useMemo(
    () => profiles.find((p) => p.id === selectedId) ?? null,
    [profiles, selectedId],
  );

  const isEditing = editingId !== null;

  /* -------------------- Render -------------------- */

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

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.companyName}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            No, Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* PAGE HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Company Profiles
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Add multiple company profiles and select one to use across the
            project.
          </Typography>
        </Box>

        <Chip
          label={
            selectedProfile
              ? `Active: ${selectedProfile.companyName}`
              : "No Profile Selected"
          }
          color={selectedProfile ? "primary" : "default"}
          variant={selectedProfile ? "filled" : "outlined"}
          sx={{
            fontWeight: 600,
            maxWidth: 280,
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      </Stack>

      {/* ================================================== */}
      {/* SECTION 1: ADD / EDIT PROFILE FORM                 */}
      {/* ================================================== */}
      <Card
        ref={formCardRef}
        elevation={0}
        sx={{ border: "1px solid #e8edf3", borderRadius: "14px", mb: 3 }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <Avatar
              sx={{
                bgcolor: isEditing ? "#fff7ed" : "#eff6ff",
                color: isEditing ? "#ea580c" : "#2563eb",
                borderRadius: "10px",
              }}
            >
              {isEditing ? <EditOutlined /> : <AddBusinessOutlined />}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700}>
                {isEditing
                  ? "Update Company Profile"
                  : "Add New Company Profile"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isEditing
                  ? "Modify the company details below and click “Update Profile”."
                  : "Enter the company details and click “Save Profile”."}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSave} noValidate>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Company Name"
                  name="companyName"
                  size="small"
                  fullWidth
                  required
                  value={form.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName || undefined}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Company Phone Number"
                  name="companyPhone"
                  size="small"
                  fullWidth
                  required
                  value={form.companyPhone}
                  onChange={handleChange}
                  inputProps={{ maxLength: 11 }}
                  error={!!errors.companyPhone}
                  helperText={errors.companyPhone || undefined}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Company WhatsApp Number"
                  name="companyWhatsapp"
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 11 }}
                  value={form.companyWhatsapp}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Company NTN Number"
                  name="companyNtn"
                  size="small"
                  inputProps={{ maxLength: 13 }}
                  fullWidth
                  value={form.companyNtn}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Company Address"
                  name="companyAddress"
                  size="small"
                  fullWidth
                  required
                  multiline
                  rows={2}
                  value={form.companyAddress}
                  onChange={handleChange}
                  error={!!errors.companyAddress}
                  helperText={errors.companyAddress || undefined}
                />
              </Grid>
            </Grid>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.5}
              mt={3}
              flexWrap="wrap"
            >
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={isEditing ? <Close /> : <RestartAlt />}
                onClick={handleReset}
                sx={{
                  borderRadius: "9px",
                  px: 3,
                  textTransform: "none",
                }}
              >
                {isEditing ? "Cancel" : "Reset"}
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
                  "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                }}
              >
                {isEditing ? "Update Profile" : "Save Profile"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* ================================================== */}
      {/* SECTION 2: PROFILES GRID                           */}
      {/* ================================================== */}
      <Card
        elevation={0}
        sx={{ border: "1px solid #e8edf3", borderRadius: "14px" }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1.5}
            mb={3}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: "#f0fdf4",
                  color: "#16a34a",
                  borderRadius: "10px",
                }}
              >
                <BusinessOutlined />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Saved Profiles
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click any profile card to make it the selected profile.
                </Typography>
              </Box>
            </Stack>

            <Chip
              size="small"
              variant="outlined"
              label={`${profiles.length} Profile${profiles.length === 1 ? "" : "s"}`}
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {profiles.length === 0 ? (
            <Box
              sx={{
                p: 5,
                textAlign: "center",
                border: "1px dashed #cbd5e1",
                borderRadius: "12px",
                bgcolor: "#f8fafc",
              }}
            >
              <BusinessOutlined
                sx={{ fontSize: 42, color: "#cbd5e1", mb: 1 }}
              />
              <Typography fontWeight={600} color="#64748b">
                No company profiles yet
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Add your first company profile using the form above.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {profiles.map((p) => {
                const isSelected = selectedId === p.id;
                const isCopied = copiedId === p.id;

                return (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      onClick={() => handleSelect(p.id)}
                      elevation={0}
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        border: isSelected
                          ? "2px solid #2563eb"
                          : "1px solid #e8edf3",
                        borderRadius: "12px",
                        bgcolor: isSelected ? "#f5f9ff" : "#fff",
                        transition: "all .15s ease",
                        "&:hover": {
                          borderColor: "#2563eb",
                          boxShadow: "0 4px 14px rgba(37,99,235,0.08)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{ minWidth: 0 }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "#eff6ff",
                                color: "#2563eb",
                                width: 40,
                                height: 40,
                              }}
                            >
                              <BusinessOutlined fontSize="small" />
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                fontWeight={700}
                                noWrap
                                sx={{ maxWidth: 160 }}
                              >
                                {p.companyName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Company Profile
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.25}
                          >
                            {isSelected && (
                              <CheckCircle
                                sx={{
                                  color: "#2563eb",
                                  fontSize: 20,
                                  mr: 0.25,
                                }}
                              />
                            )}
                            <Tooltip title="Copy official details">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(p);
                                }}
                                sx={{
                                  color: isCopied ? "#16a34a" : "#94a3b8",
                                  "&:hover": { color: "#16a34a" },
                                }}
                              >
                                {isCopied ? (
                                  <Check fontSize="small" />
                                ) : (
                                  <ContentCopyOutlined fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit profile">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStart(p);
                                }}
                                sx={{
                                  color: "#94a3b8",
                                  "&:hover": { color: "#2563eb" },
                                }}
                              >
                                <EditOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete profile">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRequest(p);
                                }}
                                sx={{
                                  color: "#94a3b8",
                                  "&:hover": { color: "#dc2626" },
                                }}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Stack spacing={1}>
                          <InfoRow
                            icon={<LocationOnOutlined />}
                            text={p.companyAddress}
                          />
                          <InfoRow
                            icon={<PhoneOutlined />}
                            text={p.companyPhone}
                          />
                          <InfoRow
                            icon={<WhatsApp />}
                            text={p.companyWhatsapp}
                          />
                          <InfoRow
                            icon={<BadgeOutlined />}
                            text={p.companyNtn}
                          />
                        </Stack>

                        {isSelected && (
                          <Chip
                            label="Selected"
                            size="small"
                            color="primary"
                            sx={{ mt: 1.5, fontWeight: 600 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
