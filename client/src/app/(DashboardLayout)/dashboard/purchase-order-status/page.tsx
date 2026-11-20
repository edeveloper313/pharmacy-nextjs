"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  AssessmentOutlined,
  FilterAltOffOutlined,
  LocalHospitalOutlined,
  PendingActionsOutlined,
  ReceiptLongOutlined,
  TaskAltOutlined,
} from "@mui/icons-material";
// Your custom toast Alert (auto-hides after 2s). Adjust path if needed.
import Alert from "@/app/components/Alert";

/* =========================================================================
   TYPES
   ========================================================================= */

type OrderStatus = "Completed" | "Partial" | "In Progress" | "Pending";

type OrderRow = {
  id: number;
  orderNo: string;
  orderDate: string;
  hospitalName: string;
  clientName: string;
  companyGroup: string;
  totalOrderQty: number;
  pendingQty: number;
  status: OrderStatus;
};

/* =========================================================================
   DEMO DATA (replace with API)
   ========================================================================= */

const demoOrders: OrderRow[] = [
  { id: 1, orderNo: "SO-2026-001", orderDate: "2026-11-01", hospitalName: "Aga Khan University Hospital", clientName: "Dr. Kamran Ali", companyGroup: "Getz Pharma",       totalOrderQty: 500,  pendingQty: 100, status: "Partial"     },
  { id: 2, orderNo: "SO-2026-002", orderDate: "2026-11-02", hospitalName: "Aga Khan University Hospital", clientName: "Dr. Kamran Ali", companyGroup: "Searle Pakistan",   totalOrderQty: 300,  pendingQty: 0,   status: "Completed"   },
  { id: 3, orderNo: "SO-2026-003", orderDate: "2026-11-03", hospitalName: "Shaukat Khanum Memorial",      clientName: "Dr. Fatima Khan", companyGroup: "Abbott Pakistan",  totalOrderQty: 800,  pendingQty: 250, status: "In Progress" },
  { id: 4, orderNo: "SO-2026-004", orderDate: "2026-11-04", hospitalName: "Shaukat Khanum Memorial",      clientName: "Dr. Fatima Khan", companyGroup: "GSK",              totalOrderQty: 200,  pendingQty: 200, status: "Pending"     },
  { id: 5, orderNo: "SO-2026-005", orderDate: "2026-11-05", hospitalName: "Al-Noor Clinic",               clientName: "Dr. Ahmed Raza", companyGroup: "Hilton Pharma",    totalOrderQty: 150,  pendingQty: 50,  status: "Partial"     },
  { id: 6, orderNo: "SO-2026-006", orderDate: "2026-11-06", hospitalName: "MedPlus Pharmacy",             clientName: "Mr. Usman Tariq", companyGroup: "Martin Dow",      totalOrderQty: 400,  pendingQty: 0,   status: "Completed"   },
  { id: 7, orderNo: "SO-2026-007", orderDate: "2026-11-07", hospitalName: "Wellness Wholesale",           clientName: "Mr. Bilal Ahmed", companyGroup: "Getz Pharma",      totalOrderQty: 1000, pendingQty: 400, status: "In Progress" },
  { id: 8, orderNo: "SO-2026-008", orderDate: "2026-11-08", hospitalName: "Aga Khan University Hospital", clientName: "Dr. Kamran Ali", companyGroup: "Martin Dow",       totalOrderQty: 250,  pendingQty: 100, status: "Partial"     },
  { id: 9, orderNo: "SO-2026-009", orderDate: "2026-11-09", hospitalName: "Al-Noor Clinic",               clientName: "Dr. Ahmed Raza", companyGroup: "Getz Pharma",      totalOrderQty: 180,  pendingQty: 30,  status: "Partial"     },
];

/* =========================================================================
   SHARED STYLES / HELPERS
   ========================================================================= */

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
  "& .MuiInputLabel-root": { fontSize: 14 },
  "& .MuiFormHelperText-root": { mx: 0, fontSize: 11 },
};

const statusChipSx = (status: OrderStatus) => {
  switch (status) {
    case "Completed":   return { bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 };
    case "Partial":     return { bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 };
    case "In Progress": return { bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 700 };
    case "Pending":     return { bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700 };
  }
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
   PAGE — Purchase Orders Status (with cascading filters)
   ========================================================================= */

export default function SalesOrderStatusPage() {
  // Filter state ("" = no filter)
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [companyGroupFilter, setCompanyGroupFilter] = useState("");
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  // Toast (your custom Alert auto-hides after 2s)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [messageId, setMessageId] = useState(0);
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setMessageId((id) => id + 1);
  };

  /* ---------------------- Cascading filter options ---------------------- */

  // Hospitals are always fully visible — user can pick any hospital to start.
  const hospitalOptions = useMemo(
    () => Array.from(new Set(demoOrders.map((o) => o.hospitalName))).sort(),
    []
  );

  // Clients are filtered by the selected hospital (doctors at that hospital).
  const clientOptions = useMemo(() => {
    const rows = hospitalFilter
      ? demoOrders.filter((o) => o.hospitalName === hospitalFilter)
      : demoOrders;
    return Array.from(new Set(rows.map((o) => o.clientName))).sort();
  }, [hospitalFilter]);

  // ⭐ Company Group is filtered by the SELECTED HOSPITAL + CLIENT.
  // Only groups that this doctor has ordered from at this hospital will appear.
  const companyGroupOptions = useMemo(() => {
    return Array.from(
      new Set(
        demoOrders
          .filter(
            (o) =>
              (!hospitalFilter || o.hospitalName === hospitalFilter) &&
              (!clientFilter || o.clientName === clientFilter)
          )
          .map((o) => o.companyGroup)
      )
    ).sort();
  }, [hospitalFilter, clientFilter]);

  // All groups (used only to show "X of Y" counter in the label)
  const totalCompanyGroups = useMemo(
    () => new Set(demoOrders.map((o) => o.companyGroup)).size,
    []
  );

  /* ---------------------- Auto-reset invalid selections ---------------------- */

  useEffect(() => {
    if (clientFilter && !clientOptions.includes(clientFilter)) setClientFilter("");
  }, [clientOptions, clientFilter]);

  useEffect(() => {
    if (companyGroupFilter && !companyGroupOptions.includes(companyGroupFilter)) {
      setCompanyGroupFilter("");
    }
  }, [companyGroupOptions, companyGroupFilter]);

  /* ---------------------- Filtered rows ---------------------- */

  const filteredOrders = useMemo(
    () =>
      demoOrders.filter(
        (o) =>
          (!hospitalFilter || o.hospitalName === hospitalFilter) &&
          (!clientFilter || o.clientName === clientFilter) &&
          (!companyGroupFilter || o.companyGroup === companyGroupFilter) &&
          (!showPendingOnly || o.pendingQty > 0)
      ),
    [hospitalFilter, clientFilter, companyGroupFilter, showPendingOnly]
  );

  /* ---------------------- Aggregates ---------------------- */

  const totalOrders = filteredOrders.length;
  const totalOrderQty = filteredOrders.reduce((s, o) => s + o.totalOrderQty, 0);
  const totalPendingQty = filteredOrders.reduce((s, o) => s + o.pendingQty, 0);
  const totalDeliveredQty = Math.max(0, totalOrderQty - totalPendingQty);
  const overallProgress = totalOrderQty > 0 ? Math.round((totalDeliveredQty / totalOrderQty) * 100) : 0;

  /* ---------------------- Handlers ---------------------- */

  const handleClearFilters = () => {
    setHospitalFilter("");
    setClientFilter("");
    setCompanyGroupFilter("");
    setShowPendingOnly(false);
    setMessage(null);
    showMessage("success", "Filters cleared.");
  };

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      showMessage("error", "No orders to export for the current filters.");
      return;
    }
    // Demo only — connect to your export/download API.
    console.log("Export Purchase Orders Status:", filteredOrders);
    showMessage("success", `Exporting ${filteredOrders.length} order(s) (demo).`);
  };

  /* ---------------------- UI ---------------------- */

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
          <Typography variant="h5" fontWeight={800} color="#1e293b">Purchase Orders Status</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Track total order quantity and pending quantity across hospitals, clients and company groups.
          </Typography>
        </Box>
        <Box sx={{ bgcolor: "#eff6ff", color: "#2563eb", borderRadius: 2, px: 1.5, py: 0.8, width: "fit-content" }}>
          <Typography fontSize={12} fontWeight={700}>ORDER STATUS OVERVIEW</Typography>
        </Box>
      </Stack>

      <Card elevation={0} sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 3, overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 3.5 }, "&:last-child": { pb: 3.5 } }}>
          <Stack spacing={3.5}>

            {/* ---------- Filters (cascading) ---------- */}
            <Section
              icon={<LocalHospitalOutlined />}
              title="Filters"
              subtitle="Company Group options narrow automatically once you pick a Hospital and Client."
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                  gap: 2,
                }}
              >
                {/* Hospital */}
                <TextField
                  fullWidth select size="small"
                  label="Hospital Name"
                  value={hospitalFilter}
                  onChange={(e) => setHospitalFilter(e.target.value)}
                  sx={fieldSx}
                >
                  <MenuItem value="">All Hospitals</MenuItem>
                  {hospitalOptions.map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </TextField>

                {/* Client (filtered by Hospital) */}
                <TextField
                  fullWidth select size="small"
                  label="Client Name"
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  helperText={hospitalFilter ? `Doctors at ${hospitalFilter}` : "All clients"}
                  sx={fieldSx}
                >
                  <MenuItem value="">All Clients</MenuItem>
                  {clientOptions.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>

                {/* Company Group (filtered by Hospital + Client) — the rightmost selector */}
                <TextField
                  fullWidth select size="small"
                  label="Company Group"
                  value={companyGroupFilter}
                  onChange={(e) => setCompanyGroupFilter(e.target.value)}
                  helperText={
                    hospitalFilter || clientFilter
                      ? `${companyGroupOptions.length} of ${totalCompanyGroups} groups ordered by this hospital/client`
                      : "All company groups"
                  }
                  sx={fieldSx}
                >
                  <MenuItem value="">All Company Groups</MenuItem>
                  {companyGroupOptions.map((g) => (
                    <MenuItem key={g} value={g}>{g}</MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Active filter chips + pending-only toggle */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1.5}
                mt={2}
                flexWrap="wrap"
              >
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {hospitalFilter && <Chip size="small" label={`Hospital: ${hospitalFilter}`} onDelete={() => setHospitalFilter("")} sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 600 }} />}
                  {clientFilter && <Chip size="small" label={`Client: ${clientFilter}`} onDelete={() => setClientFilter("")} sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 600 }} />}
                  {companyGroupFilter && <Chip size="small" label={`Group: ${companyGroupFilter}`} onDelete={() => setCompanyGroupFilter("")} sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 600 }} />}
                </Stack>

                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={showPendingOnly}
                      onChange={(e) => setShowPendingOnly(e.target.checked)}
                    />
                  }
                  label={<Typography fontSize={13} color="text.secondary">Show pending only</Typography>}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.5} mt={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<FilterAltOffOutlined />}
                  onClick={handleClearFilters}
                  sx={{ borderRadius: 2, textTransform: "none", minHeight: 40 }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AssessmentOutlined />}
                  onClick={handleExport}
                  sx={{
                    bgcolor: "#2563eb", borderRadius: 2, textTransform: "none",
                    boxShadow: "none", minHeight: 40, px: 3,
                    "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                  }}
                >
                  Export
                </Button>
              </Stack>
            </Section>

            <Divider />

            {/* ---------- Summary ---------- */}
            <Section
              icon={<AssessmentOutlined />}
              title="Order Summary"
              subtitle="Aggregated quantities for the current filter selection."
            >
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1.5 }}>
                <StatCard label="Total Orders" value={totalOrders} />
                <StatCard label="Total Order Qty" value={totalOrderQty.toLocaleString()} color="#2563eb" />
                <StatCard label="Pending Qty" value={totalPendingQty.toLocaleString()} color="#b45309" />
                <StatCard label="Delivered Qty" value={totalDeliveredQty.toLocaleString()} color="#15803d" />
              </Box>

              <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", border: "1px solid #e8edf3", borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Overall Delivery Progress</Typography>
                  <Typography variant="caption" fontWeight={700} color="#2563eb">{overallProgress}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={overallProgress}
                  sx={{ height: 8, borderRadius: 4, bgcolor: "#e2e8f0", "& .MuiLinearProgress-bar": { bgcolor: "#2563eb", borderRadius: 4 } }}
                />
                <Stack direction="row" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color="text.secondary">Delivered: {totalDeliveredQty.toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary">Pending: {totalPendingQty.toLocaleString()}</Typography>
                </Stack>
              </Box>
            </Section>

            <Divider />

            {/* ---------- Orders table ---------- */}
            <Section
              icon={<ReceiptLongOutlined />}
              title="Sales Orders"
              subtitle={`Showing ${filteredOrders.length} order(s) matching the current filters.`}
            >
              {filteredOrders.length === 0 ? (
                <Box sx={{ border: "1px dashed #cbd5e1", borderRadius: 2, p: 3, textAlign: "center", bgcolor: "#f8fafc" }}>
                  <Typography fontWeight={600} fontSize={14} color="#475569">No orders match the current filters</Typography>
                  <Typography variant="caption" color="text.secondary">Try clearing the filters or selecting a different value.</Typography>
                </Box>
              ) : (
                <TableContainer sx={{ width: "100%", border: "1px solid #e8edf3", borderRadius: 2, overflowX: "auto" }}>
                  <Table size="small" sx={{ minWidth: 950 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        {["Order No", "Date", "Hospital Name", "Client Name", "Company Group", "Total Qty", "Pending Qty", "Progress", "Status"].map((h, i) => (
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
                      {filteredOrders.map((order) => {
                        const delivered = Math.max(0, order.totalOrderQty - order.pendingQty);
                        const progress = order.totalOrderQty > 0
                          ? Math.round((delivered / order.totalOrderQty) * 100)
                          : 0;
                        return (
                          <TableRow key={order.id} hover>
                            <TableCell sx={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{order.orderNo}</TableCell>
                            <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{order.orderDate}</TableCell>
                            <TableCell sx={{ fontSize: 12, minWidth: 180 }}>{order.hospitalName}</TableCell>
                            <TableCell sx={{ fontSize: 12, minWidth: 140 }}>{order.clientName}</TableCell>
                            <TableCell sx={{ fontSize: 12, whiteSpace: "nowrap" }}>{order.companyGroup}</TableCell>
                            <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{order.totalOrderQty.toLocaleString()}</TableCell>
                            <TableCell sx={{ fontSize: 12, fontWeight: 700, color: order.pendingQty > 0 ? "#b45309" : "#15803d", whiteSpace: "nowrap" }}>
                              {order.pendingQty.toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ minWidth: 130 }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ flex: 1, minWidth: 60 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                      height: 6, borderRadius: 3, bgcolor: "#e2e8f0",
                                      "& .MuiLinearProgress-bar": {
                                        bgcolor: progress === 100 ? "#15803d" : "#2563eb",
                                        borderRadius: 3,
                                      },
                                    }}
                                  />
                                </Box>
                                <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32, textAlign: "right" }}>
                                  {progress}%
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Chip size="small" label={order.status} sx={statusChipSx(order.status)} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Section>

            {/* Custom toast */}
            {message && <Alert key={messageId} message={message.text} type={message.type} />}

            {/* Footer recap */}
            <Divider />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
            >
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <PendingActionsOutlined sx={{ fontSize: 18, color: "#b45309" }} />
                  <Typography variant="caption" color="text.secondary">
                    Pending total: <b style={{ color: "#b45309" }}>{totalPendingQty.toLocaleString()}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <TaskAltOutlined sx={{ fontSize: 18, color: "#15803d" }} />
                  <Typography variant="caption" color="text.secondary">
                    Delivered total: <b style={{ color: "#15803d" }}>{totalDeliveredQty.toLocaleString()}</b>
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {filteredOrders.length} of {demoOrders.length} orders shown
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}