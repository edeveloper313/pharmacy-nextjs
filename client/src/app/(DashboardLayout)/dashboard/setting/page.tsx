
"use client";

import React, { useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Button,
  Divider,
  TextField,
  TextFieldProps ,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  InputAdornment,
} from "@mui/material";

import {
  SettingsOutlined,
  LanguageOutlined,
  LocalPharmacyOutlined,
  ReceiptLongOutlined,
  Inventory2Outlined,
  NotificationsOutlined,
  SecurityOutlined,
  StorageOutlined,
  Save,
  RestartAlt,
  StoreOutlined,
  CurrencyExchange,
  AccessTime,
  MailOutline,
  WhatsApp,
  SmsOutlined,
  BackupOutlined,
} from "@mui/icons-material";

import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";

// ==========================================
// SETTINGS SECTION CARD
// ==========================================

const SettingsCard = ({
  icon,
  title,
  description,
  color,
  bg,
  children,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e8edf3",
        borderRadius: "14px",
        height: "100%",
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
              bgcolor: bg,
              color: color,
              borderRadius: "10px",
              width: 46,
              height: 46,
            }}
          >
            {icon}
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={700} color="#1e293b">
              {title}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {children}
      </CardContent>
    </Card>
  );
};

// ==========================================
// SETTING SWITCH
// ==========================================

const SettingSwitch = ({
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ py: 1 }}
    >
      <Box flex={1}>
        <Typography variant="body2" fontWeight={600}>
          {title}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Switch
        checked={checked}
        onChange={onChange}
        color="primary"
      />
    </Stack>
  );
};

// ==========================================
// MAIN SETTINGS PAGE
// ==========================================

export default function SettingsPage() {

  // ========================================
  // SETTINGS STATE
  // ========================================

  const initialSettings = {
    // General
    appName: "Rx Pilot",
    language: "English",
    currency: "PKR",
    timezone: "Asia/Karachi",
    dateFormat: "DD-MM-YYYY",
    timeFormat: "12",

    // Pharmacy
    pharmacyName: "Rx Pilot Pharmacy",
    businessHours: "09:00 AM - 11:00 PM",
    defaultBranch: "Main Branch",

    // Billing
    invoicePrefix: "INV",
    invoiceStart: "1001",
    taxRate: "0",
    defaultDiscount: "0",
    showLogo: true,
    showTax: true,
    showSignature: true,

    // Inventory
    lowStockAlert: true,
    expiryAlert: true,
    stockTracking: true,
    expiryDays: "30",
    lowStockQuantity: "10",

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    salesNotifications: true,
    purchaseNotifications: true,
    expiryNotifications: true,

    // Security
    twoFactor: false,
    sessionTimeout: "30",
    loginNotification: true,

    // System
    autoBackup: true,
    backupReminder: true,
    maintenanceMode: false,
  };

  const [settings, setSettings] = useState(initialSettings);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // ========================================
  // HANDLE INPUT CHANGES
  // ========================================

  const handleChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE SWITCH CHANGES
  // ========================================

  const handleSwitch = (name) => (event) => {
    handleChange(name, event.target.checked);
  };

  // ========================================
  // SAVE SETTINGS
  // ========================================

  const handleSave = async () => {
    setShowSuccess(false);
    setShowError(false);

    try {
      // Connect your settings API here.
      // Example:
      //
      // const response = await fetch("/api/settings", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(settings),
      // });
      //
      // if (!response.ok) throw new Error("Save failed");

      setShowSuccess(true);

    } catch (error) {
      setShowError(true);
    }
  };

  // ========================================
  // RESET SETTINGS
  // ========================================

  const handleReset = () => {
    setSettings(initialSettings);

    setShowSuccess(false);
    setShowError(false);
  };

  // ========================================
  // REUSABLE TEXT FIELD
  // ========================================

const inputProps = {
  size: "small" as "small" | "medium", // Yahan type assert kar dein
  fullWidth: true,
};

  const textField = (name, label, props = {}) => (
    <TextField
      {...inputProps}
      {...props}
      label={label}
      value={settings[name]}
      onChange={(e) => handleChange(name, e.target.value)}
    />
  );

  const selectField = (name, label, options) => (
    <FormControl size="small" fullWidth>
      <InputLabel>{label}</InputLabel>

      <Select
        value={settings[name]}
        label={label}
        onChange={(e) => handleChange(name, e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // ========================================
  // PAGE UI
  // ========================================

  return (
    <Box sx={{ width: "100%", pb: 4 }}>

      {/* ALERTS */}

      {showSuccess && (
        <SuccessAlert message="Settings saved successfully!" />
      )}

      {showError && (
        <ErrorAlert message="Unable to save settings. Please try again!" />
      )}

      {/* ================================= */}
      {/* PAGE HEADER */}
      {/* ================================= */}

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
            System Settings
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >
            Manage your pharmacy application preferences and configurations.
          </Typography>
        </Box>

        <Chip
          icon={<SettingsOutlined />}
          label="Configuration"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {/* ================================= */}
      {/* SETTINGS CONTENT */}
      {/* ================================= */}

      <Grid container spacing={3}>

        {/* ================================= */}
        {/* 1. GENERAL SETTINGS */}
        {/* ================================= */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <SettingsCard
            icon={<LanguageOutlined />}
            title="General Settings"
            description="Application preferences and localization"
            color="#2563eb"
            bg="#eff6ff"
          >
            <Grid container spacing={2.5}>

              <Grid size={12}>
                {textField("appName", "Application Name")}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {selectField("language", "Language", [
                  { value: "English", label: "English" },
                  { value: "Urdu", label: "Urdu" },
                ])}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {selectField("currency", "Currency", [
                  { value: "PKR", label: "PKR - Pakistani Rupee" },
                  { value: "USD", label: "USD - US Dollar" },
                  { value: "AED", label: "AED - UAE Dirham" },
                  { value: "SAR", label: "SAR - Saudi Riyal" },
                ])}
              </Grid>

              <Grid size={12}>
                {selectField("timezone", "Timezone", [
                  { value: "Asia/Karachi", label: "Asia/Karachi" },
                  { value: "Asia/Dubai", label: "Asia/Dubai" },
                  { value: "Asia/Riyadh", label: "Asia/Riyadh" },
                  { value: "UTC", label: "UTC" },
                ])}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {selectField("dateFormat", "Date Format", [
                  { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
                  { value: "MM-DD-YYYY", label: "MM-DD-YYYY" },
                  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                ])}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {selectField("timeFormat", "Time Format", [
                  { value: "12", label: "12 Hours" },
                  { value: "24", label: "24 Hours" },
                ])}
              </Grid>

            </Grid>
          </SettingsCard>
        </Grid>

        {/* ================================= */}
        {/* 2. PHARMACY SETTINGS */}
        {/* ================================= */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <SettingsCard
            icon={<LocalPharmacyOutlined />}
            title="Pharmacy Settings"
            description="Default pharmacy and branch preferences"
            color="#16a34a"
            bg="#f0fdf4"
          >
            <Grid container spacing={2.5}>

              <Grid size={12}>
                {textField("pharmacyName", "Pharmacy Name")}
              </Grid>

              <Grid size={12}>
                {textField("defaultBranch", "Default Branch", {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <StoreOutlined fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                })}
              </Grid>

              <Grid size={12}>
                {textField("businessHours", "Business Hours", {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                })}
              </Grid>

              <Grid size={12}>
                <Box
                  p={2}
                  bgcolor="#f0fdf4"
                  borderRadius="10px"
                >
                  <Typography variant="body2" fontWeight={600}>
                    Pharmacy Configuration
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    These settings define your default pharmacy and branch.
                    You can change them whenever required.
                  </Typography>
                </Box>
              </Grid>

            </Grid>
          </SettingsCard>
        </Grid>

        {/* ================================= */}
        {/* 3. SALES & BILLING */}
        {/* ================================= */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <SettingsCard
            icon={<ReceiptLongOutlined />}
            title="Sales & Billing"
            description="Invoice, tax and discount configuration"
            color="#9333ea"
            bg="#faf5ff"
          >
            <Grid container spacing={2.5}>

              <Grid size={{ xs: 12, sm: 6 }}>
                {textField("invoicePrefix", "Invoice Prefix")}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {textField("invoiceStart", "Starting Invoice Number", {
                  type: "number",
                })}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {textField("taxRate", "Tax Rate", {
                  type: "number",
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                })}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {textField("defaultDiscount", "Default Discount", {
                  type: "number",
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                })}
              </Grid>

              <Grid size={12}>
                <Divider />
              </Grid>

              <Grid size={12}>
                <SettingSwitch
                  title="Show Pharmacy Logo"
                  description="Display logo on printed invoices."
                  checked={settings.showLogo}
                  onChange={handleSwitch("showLogo")}
                />

                <SettingSwitch
                  title="Show Tax Information"
                  description="Display tax details on invoices."
                  checked={settings.showTax}
                  onChange={handleSwitch("showTax")}
                />

                <SettingSwitch
                  title="Authorized Signature"
                  description="Show signature area on printed invoices."
                  checked={settings.showSignature}
                  onChange={handleSwitch("showSignature")}
                />
              </Grid>

            </Grid>
          </SettingsCard>
        </Grid>

        {/* ================================= */}
        {/* 4. INVENTORY SETTINGS */}
        {/* ================================= */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <SettingsCard
            icon={<Inventory2Outlined />}
            title="Inventory Settings"
            description="Stock monitoring and expiry management"
            color="#ea580c"
            bg="#fff7ed"
          >
            <Grid container spacing={2.5}>

              <Grid size={12}>
                {textField("lowStockQuantity", "Low Stock Threshold", {
                  type: "number",
                  helperText: "Alert when product quantity reaches this level.",
                })}
              </Grid>

              <Grid size={12}>
                {textField("expiryDays", "Expiry Warning Days", {
                  type: "number",
                  helperText: "Notify before product expiry.",
                })}
              </Grid>

              <Grid size={12}>
                <Divider />
              </Grid>

              <Grid size={12}>
                <SettingSwitch
                  title="Low Stock Alerts"
                  description="Notify when products reach minimum stock."
                  checked={settings.lowStockAlert}
                  onChange={handleSwitch("lowStockAlert")}
                />

                <SettingSwitch
                  title="Expiry Alerts"
                  description="Notify about products approaching expiry."
                  checked={settings.expiryAlert}
                  onChange={handleSwitch("expiryAlert")}
                />

                <SettingSwitch
                  title="Stock Tracking"
                  description="Enable inventory quantity monitoring."
                  checked={settings.stockTracking}
                  onChange={handleSwitch("stockTracking")}
                />
              </Grid>

            </Grid>
          </SettingsCard>
        </Grid>

        {/* ================================= */}
        {/* 5. NOTIFICATION SETTINGS */}
        {/* ================================= */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <SettingsCard
            icon={<NotificationsOutlined />}
            title="Notification Settings"
            description="Manage alerts and communication channels"
            color="#0891b2"
            bg="#ecfeff"
          >
            <Stack spacing={1}>

              <SettingSwitch
                title="Email Notifications"
                description="Receive updates through email."
                checked={settings.emailNotifications}
                onChange={handleSwitch("emailNotifications")}
              />

              <Divider />

              <SettingSwitch
                title="SMS Notifications"
                description="Receive important updates through SMS."
                checked={settings.smsNotifications}
                onChange={handleSwitch("smsNotifications")}
              />

              <Divider />

              <SettingSwitch
                title="WhatsApp Notifications"
                description="Receive updates through WhatsApp."
                checked={settings.whatsappNotifications}
                onChange={handleSwitch("whatsappNotifications")}
              />

              <Divider />

              <SettingSwitch
                title="Sales Notifications"
                description="Receive notifications for new sales."
                checked={settings.salesNotifications}
                onChange={handleSwitch("salesNotifications")}
              />

              <Divider />

              <SettingSwitch
                title="Purchase Notifications"
                description="Receive notifications for new purchases."
                checked={settings.purchaseNotifications}
                onChange={handleSwitch("purchaseNotifications")}
              />

              <Divider />

              <SettingSwitch
                title="Expiry Notifications"
                description="Receive medicine expiry notifications."
                checked={settings.expiryNotifications}
                onChange={handleSwitch("expiryNotifications")}
              />

            </Stack>
          </SettingsCard>
        </Grid>

        {/* ================================= */}
        {/* 6. SECURITY SETTINGS */}
        {/* ================================= */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <SettingsCard
            icon={<SecurityOutlined />}
            title="Security Settings"
            description="Account security and session management"
            color="#dc2626"
            bg="#fef2f2"
          >
            <Grid container spacing={2.5}>

              <Grid size={12}>
                {selectField("sessionTimeout", "Session Timeout", [
                  { value: "15", label: "15 Minutes" },
                  { value: "30", label: "30 Minutes" },
                  { value: "60", label: "1 Hour" },
                  { value: "120", label: "2 Hours" },
                ])}
              </Grid>

              <Grid size={12}>
                <Divider />
              </Grid>

              <Grid size={12}>
                <SettingSwitch
                  title="Two-Factor Authentication"
                  description="Require an additional verification step during login."
                  checked={settings.twoFactor}
                  onChange={handleSwitch("twoFactor")}
                />

                <Divider />

                <SettingSwitch
                  title="Login Notifications"
                  description="Get notified when a new login occurs."
                  checked={settings.loginNotification}
                  onChange={handleSwitch("loginNotification")}
                />
              </Grid>

              <Grid size={12}>
                <Box
                  p={2}
                  bgcolor="#fef2f2"
                  borderRadius="10px"
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="#b91c1c"
                  >
                    Security Recommendation
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Enable two-factor authentication to improve account security.
                  </Typography>
                </Box>
              </Grid>

            </Grid>
          </SettingsCard>
        </Grid>

        {/* ================================= */}
        {/* 7. SYSTEM SETTINGS */}
        {/* ================================= */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <SettingsCard
            icon={<StorageOutlined />}
            title="System Preferences"
            description="Backup and system maintenance"
            color="#475569"
            bg="#f1f5f9"
          >
            <Stack spacing={1}>

              <SettingSwitch
                title="Automatic Backup"
                description="Enable scheduled system backups."
                checked={settings.autoBackup}
                onChange={handleSwitch("autoBackup")}
              />

              <Divider />

              <SettingSwitch
                title="Backup Reminders"
                description="Receive reminders for system backups."
                checked={settings.backupReminder}
                onChange={handleSwitch("backupReminder")}
              />

              <Divider />

              <SettingSwitch
                title="Maintenance Mode"
                description="Enable maintenance mode for system maintenance."
                checked={settings.maintenanceMode}
                onChange={handleSwitch("maintenanceMode")}
              />

              <Box
                mt={2}
                p={2}
                bgcolor="#f8fafc"
                borderRadius="10px"
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#2563eb",
                      width: 38,
                      height: 38,
                    }}
                  >
                    <BackupOutlined />
                  </Avatar>

                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      System Backup
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Configure automatic backup through your backend.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

            </Stack>
          </SettingsCard>
        </Grid>

      </Grid>

      {/* ================================= */}
      {/* SAVE & RESET BUTTONS */}
      {/* ================================= */}

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        justifyContent="flex-end"
        spacing={1.5}
        mt={3}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RestartAlt />}
          onClick={handleReset}
          sx={{
            borderRadius: "9px",
            px: 3,
            textTransform: "none",
          }}
        >
          Reset Defaults
        </Button>

        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
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
          Save Settings
        </Button>
      </Stack>

    </Box>
  );
}
