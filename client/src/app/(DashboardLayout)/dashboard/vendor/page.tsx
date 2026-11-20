"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  MenuItem,
  Divider,
  Avatar,
  InputAdornment,
} from "@mui/material";
import type { AlertColor } from "@mui/material/Alert";
import {
  PersonOutline,
  AssignmentOutlined,
  LocalPharmacyOutlined,
  SaveOutlined,
  RestartAltOutlined,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";

// Reuse the alert component and AlertState type already present in the project.
import Alert from "@/app/components/Alert";
import type { AlertState } from "@/app/components/types/types";

type VendorType =
  | "Clinic"
  | "Doctor"
  | "Hospital"
  | "Pharmacy / Medical Store"
  | "Wholesale Distributor";

type VendorForm = {
  vendorType: VendorType | "";
  purchaserName: string;
  city: string;
  area: string;
  address: string;
  registrationNumber: string;
  ntn: string;
  strn: string;
  whatsappnumber: string;
  
};


const createEmptyForm = (): VendorForm => ({
  vendorType: "",
  purchaserName: "",
  city: "",
  area: "",
  address: "",
  registrationNumber: "",
  ntn: "",
  strn: "",
  whatsappnumber: "",
  
});
const vendorTypes: VendorType[] = [
  "Clinic",
  "Doctor",
  "Hospital",
  "Pharmacy / Medical Store",
  "Wholesale Distributor",
];

const creditOptions = [
  { label: "Cash / Immediate", value: "0" },
  { label: "15 Days", value: "15" },
  { label: "30 Days", value: "30" },
  { label: "45 Days", value: "45" },
  { label: "60 Days", value: "60" },
  { label: "90 Days", value: "90" },
];

const fieldSx = {
  minWidth: 0,
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
  "& .MuiInputLabel-root": { fontSize: 14 },
  "& .MuiFormHelperText-root": { mx: 0, fontSize: 11 },
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  gap: 2,
  "& > *": { minWidth: 0 },
};

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

// Defined outside the page component to prevent remounting on every keystroke.
function Section({ icon, title, subtitle, children }: SectionProps) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "#eff6ff",
            color: "#2563eb",
            width: 42,
            height: 42,
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          {icon}
        </Avatar>
        <Box minWidth={0}>
          <Typography fontWeight={700} fontSize={16}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {children}
    </Box>
  );
}

export default function VendorEntryPage() {
  const [form, setForm] = useState<VendorForm>(createEmptyForm);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (type: AlertColor, message: string) => {
    setAlert({ type, message });
  };

  // One handler supports both regular TextFields and MUI select fields.
  const handleChange = (event: {
    target: { name: string; value: unknown };
  }) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: String(value) }));
    setAlert(null);
  };

  const handleReset = () => {
    setForm(createEmptyForm());
    setAlert(null);
  };

  const handleSave = () => {
    const requiredFields: (keyof VendorForm)[] = [
      "vendorType",
      "purchaserName",
      "whatsappnumber",
      "city",
      "address",
 
    ];

    const missingFields = requiredFields.filter(
      (key) => !String(form[key] ?? "").trim(),
    );

    if (missingFields.length > 0) {
      showAlert("error", `Please fill: ${missingFields.join(", ")}`);
      return;
    }

    // Accept Pakistani mobile numbers with optional spaces or hyphens.
    const normalizedPhone = form.whatsappnumber.replace(/[\s-]/g, "");
    if (!/^03\d{9}$/.test(normalizedPhone)) {
      showAlert(
        "error",
        "Please enter a valid Pakistani mobile number (03XXXXXXXXX).",
      );
      return;
    }

    setForm(createEmptyForm());
    showAlert("success", "Vendor details validated successfully.");
  };
  const getRegistrationLabel = () => {
    switch (form.vendorType) {
      case "Clinic":
        return "Clinic Registration Number";
      case "Doctor":
        return "PMDC Registration Number";
      case "Hospital":
        return "Hospital Registration Number";
      case "Pharmacy / Medical Store":
        return "Drug Sale License Number";
      case "Wholesale Distributor":
        return "Drug Distribution License Number";
      default:
        return "Registration Number";
    }
  };

  const getRegistrationPlaceholder = () => {
    switch (form.vendorType) {
      case "Clinic":
        return "Enter clinic registration number";
      case "Doctor":
        return "e.g. PMDC-12345";
      case "Hospital":
        return "Enter hospital registration number";
      case "Pharmacy / Medical Store":
        return "Enter drug sale license number";
      case "Wholesale Distributor":
        return "Enter distribution license number";
      default:
        return "Enter registration number";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        pb: 4,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Vendor Entry
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Register and manage pharmaceutical vendors.
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#eff6ff",
            color: "#2563eb",
            borderRadius: 2,
            px: 1.5,
            py: 0.8,
            width: "fit-content",
          }}
        >
          <Typography fontSize={12} fontWeight={700}>
            NEW VENDOR
          </Typography>
        </Box>
      </Stack>

      <Card
        elevation={0}
        sx={{
          width: "100%",
          minWidth: 0,
          border: "1px solid #e8edf3",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3, md: 3.5 },
            "&:last-child": { pb: { xs: 2, sm: 3, md: 3.5 } },
          }}
        >
          <Stack spacing={3.5}>
            <Section
              icon={<LocalPharmacyOutlined />}
              title="Vendor Information"
              subtitle="Basic business and vendor details."
            >
              <Box sx={gridSx}>
                <TextField
                  select
                  fullWidth
                  required
                  size="small"
                  label="Vendor Type"
                  name="vendorType"
                  value={form.vendorType}
                  onChange={handleChange}
                  sx={{ ...fieldSx, gridColumn: "1 / -1" }}
                >
                  <MenuItem value="">Select vendor type</MenuItem>
                  {vendorTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Vendor / Business Name"
                  name="purchaserName"
                  value={form.purchaserName}
                  onChange={handleChange}
                  placeholder="e.g. City Medical Store"
                  sx={{ ...fieldSx, gridColumn: "1 / -1" }}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Whatsapp number"
                  name="whatsappnumber"
                  value={form.whatsappnumber}
                  onChange={handleChange}
                  placeholder="030XXXXXXX"
                  inputProps={{ maxLength: 11 }}
                  sx={{ ...fieldSx, gridColumn: "1 / -1" }}
                />
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Karachi"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Area / Sales Zone"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="e.g. Gulshan-e-Iqbal"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={2}
                  size="small"
                  label="Business Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter complete business address"
                  sx={{ ...fieldSx, gridColumn: "1 / -1" }}
                />
              </Box>
            </Section>

            <Divider />

            <Section
              icon={<AssignmentOutlined />}
              title="Registration & Tax Information"
              subtitle="Business license and tax registration details."
            >
              <Box sx={gridSx}>
                <TextField
                  fullWidth
                  size="small"
                  label={getRegistrationLabel()}
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  placeholder={getRegistrationPlaceholder()}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="NTN Number"
                  name="ntn"
                  value={form.ntn}
                  onChange={handleChange}
                  placeholder="e.g. 1234567-8"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="STRN Number"
                  name="strn"
                  value={form.strn}
                  onChange={handleChange}
                  placeholder="Enter sales tax registration"
                  sx={{ ...fieldSx, gridColumn: "1 / -1" }}
                />
              </Box>
            </Section>

            <Divider />

      

            

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              justifyContent="flex-end"
              spacing={1.5}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<RestartAltOutlined />}
                onClick={handleReset}
                sx={{ borderRadius: 2, textTransform: "none", minHeight: 42 }}
              >
                Reset Form
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={handleSave}
                sx={{
                  bgcolor: "#2563eb",
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "none",
                  minHeight: 42,
                  px: 3,
                  "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                }}
              >
                Save Vendor
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Existing project alert component (alert.tsx), not a newly-created alert. */}
      {alert && (
        <Alert
          key={`${alert.type}-${alert.message}`}
          type={alert.type}
          message={alert.message}
        />
      )}
    </Box>
  );
}
