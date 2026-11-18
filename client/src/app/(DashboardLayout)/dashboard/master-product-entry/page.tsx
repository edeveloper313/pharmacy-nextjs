"use client";

import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AddOutlined,
  DeleteOutline,
  Inventory2Outlined,
  ReceiptLongOutlined,
  RestartAltOutlined,
  SaveOutlined,
  DescriptionOutlined,
  ViewListOutlined,
} from "@mui/icons-material";
// Your custom toast Alert (auto-hides after 2s). Adjust path if needed.
import Alert from "@/app/components/Alert";

/* =========================================================================
   TYPES
   ========================================================================= */

type MasterProductEntry = {
  id: number;
  date: string;
  hospitalName: string;
  productName: string;
  clientName: string;
  groupName: string;
};

type FormState = {
  date: string;
  hospitalName: string;
  productName: string;
  clientName: string;
  groupName: string;
};

const emptyForm: FormState = {
  date: "",
  hospitalName: "",
  productName: "",
  clientName: "",
  groupName: "",
};

type SummaryRow = {
  productName: string;
  totalEntries: number;
  hospitals: string[];
  clients: string[];
  groups: string[];
};

/* =========================================================================
   DEMO DATA
   ========================================================================= */

const hospitalOptions = [
  "Aga Khan University Hospital",
  "Shaukat Khanum Memorial",
  "Al-Noor Clinic",
  "MedPlus Pharmacy",
  "Wellness Wholesale",
];

const clientOptions = [
  "Dr. Kamran Ali",
  "Dr. Fatima Khan",
  "Dr. Ahmed Raza",
  "Mr. Usman Tariq",
  "Mr. Bilal Ahmed",
];

const groupOptions = [
  "Getz Pharma",
  "Searle Pakistan",
  "Abbott Pakistan",
  "GSK",
  "Hilton Pharma",
  "Martin Dow",
];

const demoEntries: MasterProductEntry[] = [
  { id: 1, date: "2026-11-01", hospitalName: "Aga Khan University Hospital", productName: "Paracetamol 500mg",  clientName: "Dr. Kamran Ali",   groupName: "Getz Pharma" },
  { id: 2, date: "2026-11-02", hospitalName: "Aga Khan University Hospital", productName: "Amoxicillin 500mg",  clientName: "Dr. Kamran Ali",   groupName: "Getz Pharma" },
  { id: 3, date: "2026-11-03", hospitalName: "Shaukat Khanum Memorial",      productName: "Panadol Extra",      clientName: "Dr. Fatima Khan",  groupName: "GSK" },
  { id: 4, date: "2026-11-04", hospitalName: "Shaukat Khanum Memorial",      productName: "Brufen 400mg",       clientName: "Dr. Fatima Khan",  groupName: "Abbott Pakistan" },
  { id: 5, date: "2026-11-05", hospitalName: "Al-Noor Clinic",               productName: "Ventolin Inhaler",   clientName: "Dr. Ahmed Raza",   groupName: "Hilton Pharma" },
  { id: 6, date: "2026-11-06", hospitalName: "MedPlus Pharmacy",             productName: "Insulin Glargine",   clientName: "Mr. Usman Tariq",  groupName: "Martin Dow" },
  { id: 7, date: "2026-11-07", hospitalName: "Wellness Wholesale",           productName: "Omeprazole 20mg",    clientName: "Mr. Bilal Ahmed",  groupName: "Getz Pharma" },
  { id: 8, date: "2026-11-08", hospitalName: "Aga Khan University Hospital", productName: "Paracetamol 500mg",  clientName: "Dr. Kamran Ali",   groupName: "Searle Pakistan" },
  { id: 9, date: "2026-11-09", hospitalName: "Al-Noor Clinic",               productName: "Ventolin Inhaler",   clientName: "Dr. Ahmed Raza",   groupName: "GSK" },
];

/* =========================================================================
   SHARED STYLES / HELPERS
   ========================================================================= */

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
  "& .MuiInputLabel-root": { fontSize: 14 },
  "& .MuiFormHelperText-root": { mx: 0, fontSize: 11 },
};

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function Section({ icon, title, subtitle, children }: SectionProps) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#2563eb", width: 42, height: 42, borderRadius: 2 }}>
          {icon}
        </Avatar>
        <Box minWidth={0}>
          <Typography fontWeight={700} fontSize={16}>{title}</Typography>
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        </Box>
      </Stack>
      {children}
    </Box>
  );
}

type StatCardProps = { label: string; value: string | number; color?: string };
function StatCard({ label, value, color = "#1e293b" }: StatCardProps) {
  return (
    <Box sx={{ p: 2, border: "1px solid #e8edf3", bgcolor: "#fff", borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography fontWeight={800} fontSize={20} color={color}>{value}</Typography>
    </Box>
  );
}

/* =========================================================================
   PAGE — Master Product Entry
   ========================================================================= */

export default function MasterProductEntryPage() {
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [entries, setEntries] = useState<MasterProductEntry[]>(demoEntries);
  const [viewMode, setViewMode] = useState<"detail" | "summary">("detail");

  // Toast
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [messageId, setMessageId] = useState(0);
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  /* ------- Handlers ------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleAddEntry = () => {
    if (!form.date || !form.hospitalName || !form.productName.trim() || !form.clientName || !form.groupName) {
      showMessage("error", "Please fill all fields before saving the entry.");
      return;
    }
    const newEntry: MasterProductEntry = {
      id: Date.now(),
      date: form.date,
      hospitalName: form.hospitalName,
      productName: form.productName.trim(),
      clientName: form.clientName,
      groupName: form.groupName,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setForm({ ...emptyForm });
    showMessage("success", "Master product entry added.");
  };

  const handleRemove = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showMessage("success", "Entry removed.");
  };

  const handleResetForm = () => {
    setForm({ ...emptyForm });
    setMessage(null);
  };

  const handleSaveAll = () => {
    if (entries.length === 0) {
      showMessage("error", "No entries to save.");
      return;
    }
    // Demo only — connect to your API.
    console.log("Master Product Entries:", entries);
    showMessage("success", `Saved ${entries.length} master entries (demo).`);
  };

  /* ------- Summary: aggregate by product ------- */
  const summaryRows: SummaryRow[] = useMemo(() => {
    const map = new Map<string, SummaryRow>();
    entries.forEach((e) => {
      if (!map.has(e.productName)) {
        map.set(e.productName, {
          productName: e.productName,
          totalEntries: 0,
          hospitals: [],
          clients: [],
          groups: [],
        });
      }
      const row = map.get(e.productName)!;
      row.totalEntries += 1;
      if (!row.hospitals.includes(e.hospitalName)) row.hospitals.push(e.hospitalName);
      if (!row.clients.includes(e.clientName)) row.clients.push(e.clientName);
      if (!row.groups.includes(e.groupName)) row.groups.push(e.groupName);
    });
    return Array.from(map.values()).sort((a, b) => b.totalEntries - a.totalEntries);
  }, [entries]);

  const totalEntries = entries.length;
  const totalProducts = new Set(entries.map((e) => e.productName)).size;
  const totalHospitals = new Set(entries.map((e) => e.hospitalName)).size;
  const totalGroups = new Set(entries.map((e) => e.groupName)).size;

  /* ------- UI ------- */
  return (
    <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0, overflowX: "hidden", pb: 4 }}>
      {/* Page header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1e293b">Master Product Entry</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Record product master data and view entries in detail or summary.
          </Typography>
        </Box>
        <Box sx={{ bgcolor: "#eff6ff", color: "#2563eb", borderRadius: 2, px: 1.5, py: 0.8, width: "fit-content" }}>
          <Typography fontSize={12} fontWeight={700}>MASTER PRODUCT</Typography>
        </Box>
      </Stack>

      <Card elevation={0} sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 3, overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}>
          <Stack spacing={3.5}>

            {/* ---------- Entry form ---------- */}
            <Section
              icon={<Inventory2Outlined />}
              title="Entry Form"
              subtitle="Fill all fields and click Save Entry to add to the master list."
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth required size="small" type="date"
                  label="Date" name="date"
                  value={form.date} onChange={handleChange}
                  InputLabelProps={{ shrink: true }} sx={fieldSx}
                />
                <TextField
                  fullWidth required select size="small"
                  label="Hospital Name" name="hospitalName"
                  value={form.hospitalName} onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="" disabled>Select hospital</MenuItem>
                  {hospitalOptions.map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth required size="small"
                  label="Product Name" name="productName"
                  value={form.productName} onChange={handleChange}
                  placeholder="e.g. Paracetamol 500mg"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth required select size="small"
                  label="Client Name" name="clientName"
                  value={form.clientName} onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="" disabled>Select client</MenuItem>
                  {clientOptions.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth required select size="small"
                  label="Group Name" name="groupName"
                  value={form.groupName} onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="" disabled>Select group</MenuItem>
                  {groupOptions.map((g) => (
                    <MenuItem key={g} value={g}>{g}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  startIcon={<AddOutlined />}
                  onClick={handleAddEntry}
                  sx={{
                    bgcolor: "#2563eb", borderRadius: 2, textTransform: "none",
                    boxShadow: "none", minHeight: 42, px: 3,
                    "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                  }}
                >
                  Save Entry
                </Button>
              </Stack>
            </Section>

            <Divider />

            {/* ---------- Data view with Detail/Summary toggle ---------- */}
            <Section
              icon={<ReceiptLongOutlined />}
              title="Master Entries"
              subtitle="Switch between Detail (full list) and Summary (grouped by product)."
            >
              {/* Toggle row */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1.5}
                mb={2}
              >
                <Typography variant="caption" color="text.secondary">
                  {entries.length} total entr{entries.length === 1 ? "y" : "ies"}
                </Typography>
                <ToggleButtonGroup
                  size="small"
                  value={viewMode}
                  exclusive
                  onChange={(_, val) => { if (val) setViewMode(val); }}
                  sx={{
                    "& .MuiToggleButton-root": {
                      textTransform: "none", px: 2, borderRadius: 2,
                      border: "1px solid #e8edf3", color: "#475569",
                      "&.Mui-selected": { bgcolor: "#2563eb", color: "#fff", borderColor: "#2563eb" },
                      "&.Mui-selected:hover": { bgcolor: "#1d4ed8" },
                    },
                  }}
                >
                  <ToggleButton value="detail">
                    <ViewListOutlined fontSize="small" sx={{ mr: 0.75 }} />
                    Detail
                  </ToggleButton>
                  <ToggleButton value="summary">
                    <DescriptionOutlined fontSize="small" sx={{ mr: 0.75 }} />
                    Summary
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              {/* -------- Detail view -------- */}
              {viewMode === "detail" && (
                entries.length === 0 ? (
                  <Box sx={{ border: "1px dashed #cbd5e1", borderRadius: 2, p: 3, textAlign: "center", bgcolor: "#f8fafc" }}>
                    <Typography fontWeight={600} fontSize={14} color="#475569">No entries yet</Typography>
                    <Typography variant="caption" color="text.secondary">Add your first entry using the form above.</Typography>
                  </Box>
                ) : (
                  <TableContainer sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 2, overflowX: "auto" }}>
                    <Table size="small" sx={{ minWidth: 850 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          {["Date", "Hospital Name", "Product Name", "Client Name", "Group Name", ""].map((h, i) => (
                            <TableCell
                              key={`${h}-${i}`}
                              sx={{ fontWeight: 700, color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id} hover>
                            <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{entry.date}</TableCell>
                            <TableCell sx={{ fontSize: 12, minWidth: 180 }}>{entry.hospitalName}</TableCell>
                            <TableCell sx={{ fontSize: 12, minWidth: 160 }}>{entry.productName}</TableCell>
                            <TableCell sx={{ fontSize: 12, minWidth: 140 }}>{entry.clientName}</TableCell>
                            <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{entry.groupName}</TableCell>
                            <TableCell>
                              <Tooltip title="Remove entry">
                                <IconButton size="small" color="error" onClick={() => handleRemove(entry.id)}>
                                  <DeleteOutline fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              )}

              {/* -------- Summary view -------- */}
              {viewMode === "summary" && (
                <>
                  {/* Stat cards */}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1.5, mb: 2 }}>
                    <StatCard label="Total Entries" value={totalEntries} />
                    <StatCard label="Unique Products" value={totalProducts} color="#2563eb" />
                    <StatCard label="Hospitals Covered" value={totalHospitals} color="#15803d" />
                    <StatCard label="Groups Involved" value={totalGroups} color="#b45309" />
                  </Box>

                  {summaryRows.length === 0 ? (
                    <Box sx={{ border: "1px dashed #cbd5e1", borderRadius: 2, p: 3, textAlign: "center", bgcolor: "#f8fafc" }}>
                      <Typography fontWeight={600} fontSize={14} color="#475569">No products to summarize</Typography>
                    </Box>
                  ) : (
                    <TableContainer sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 2, overflowX: "auto" }}>
                      <Table size="small" sx={{ minWidth: 850 }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f8fafc" }}>
                            {["Product Name", "Total Entries", "Hospitals", "Clients", "Groups"].map((h, i) => (
                              <TableCell
                                key={`${h}-${i}`}
                                sx={{ fontWeight: 700, color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}
                              >
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {summaryRows.map((row) => (
                            <TableRow key={row.productName} hover>
                              <TableCell sx={{ fontSize: 12, minWidth: 160, fontWeight: 600 }}>{row.productName}</TableCell>
                              <TableCell sx={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{row.totalEntries}</TableCell>
                              <TableCell sx={{ fontSize: 12 }}>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                  {row.hospitals.map((h) => (
                                    <Chip key={h} size="small" label={h} sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 500, fontSize: 11 }} />
                                  ))}
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ fontSize: 12 }}>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                  {row.clients.map((c) => (
                                    <Chip key={c} size="small" label={c} sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 500, fontSize: 11 }} />
                                  ))}
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ fontSize: 12 }}>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                  {row.groups.map((g) => (
                                    <Chip key={g} size="small" label={g} sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 500, fontSize: 11 }} />
                                  ))}
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </Section>

            {/* Toast */}
            {message && <Alert key={messageId} message={message.text} type={message.type} />}

            <Divider />

            {/* Actions */}
            <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<RestartAltOutlined />}
                onClick={handleResetForm}
                sx={{ borderRadius: 2, textTransform: "none", minHeight: 42 }}
              >
                Reset Form
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={handleSaveAll}
                sx={{
                  bgcolor: "#2563eb", borderRadius: 2, textTransform: "none",
                  boxShadow: "none", minHeight: 42, px: 3,
                  "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                }}
              >
                Save All Entries
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}