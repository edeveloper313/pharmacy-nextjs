"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  AlertColor,
} from "@mui/material";
import {
  Add,
  Search,
  EditOutlined,
  DeleteOutline,
  DownloadOutlined,
  DescriptionOutlined,
  Close,
  Refresh,
  AssessmentOutlined,
} from "@mui/icons-material";

// Make sure these paths match your project structure
import Alert from "@/app/components/Alert";
import { AlertState } from "@/app/components/types/types";

// ============================================
// [BLOCK 1 START: TYPES & DUMMY DATA]
// ============================================
type CustomerType =
  | "Pharmacies / Medical Stores"
  | "Hospitals"
  | "Clinics"
  | "Wholesale Distributors"
  | "Doctors";

interface ClientReportEntry {
  id: number;
  reportDate: string;
  customerType: CustomerType | "";
  hospitalName: string;
  productName: string;
  clientName: string;
  groupName: string;
}

const CUSTOMER_TYPES: CustomerType[] = [
  "Pharmacies / Medical Stores",
  "Hospitals",
  "Clinics",
  "Wholesale Distributors",
  "Doctors",
];

// Realistic Pharmacy Distribution Dummy Data
const initialEntries: ClientReportEntry[] = [
  {
    id: 1,
    reportDate: "2026-11-18",
    customerType: "Hospitals",
    hospitalName: "Aga Khan University Hospital",
    productName: "Augmentin 625mg Tab (Box)",
    clientName: "AKUH Central Pharmacy",
    groupName: "Institutional - Karachi South",
  },
  {
    id: 2,
    reportDate: "2026-11-17",
    customerType: "Pharmacies / Medical Stores",
    hospitalName: "N/A (Retail Outlet)",
    productName: "Panadol Extra 500mg Strip",
    clientName: "Al-Shifa Medical Store",
    groupName: "Retail Chain - Lahore",
  },
  {
    id: 3,
    reportDate: "2026-11-15",
    customerType: "Wholesale Distributors",
    hospitalName: "Multi-Hospital Supply",
    productName: "Insulin Lantus SoloStar Pen",
    clientName: "MedLink Pharma Distributors",
    groupName: "Wholesale Tier-A",
  },
  {
    id: 4,
    reportDate: "2026-11-14",
    customerType: "Clinics",
    hospitalName: "Shifa Care Dental & Poly Clinic",
    productName: "Amoxil 500mg Cap",
    clientName: "Shifa Care Clinic",
    groupName: "Clinics Network - Islamabad",
  },
  {
    id: 5,
    reportDate: "2026-11-12",
    customerType: "Doctors",
    hospitalName: "Liaquat National Hospital",
    productName: "Risek 40mg Cap",
    clientName: "Dr. Kamran Siddiqui",
    groupName: "Key Opinion Leaders (KOL)",
  },
];

// Strictly NO default values — placeholders show exact input format
const emptyForm: Omit<ClientReportEntry, "id"> = {
  reportDate: "",
  customerType: "",
  hospitalName: "",
  productName: "",
  clientName: "",
  groupName: "",
};
// [BLOCK 1 END: TYPES & DUMMY DATA]

// ============================================
// [BLOCK 2 START: SORTING HELPERS]
// ============================================
const descendingComparator = (
  a: ClientReportEntry,
  b: ClientReportEntry,
  orderBy: keyof ClientReportEntry
) => {
  const first = a[orderBy] ?? "";
  const second = b[orderBy] ?? "";
  return String(second).localeCompare(String(first), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const getComparator = (
  order: "asc" | "desc",
  orderBy: keyof ClientReportEntry
) =>
  order === "desc"
    ? (a: ClientReportEntry, b: ClientReportEntry) =>
        descendingComparator(a, b, orderBy)
    : (a: ClientReportEntry, b: ClientReportEntry) =>
        -descendingComparator(a, b, orderBy);
// [BLOCK 2 END: SORTING HELPERS]

export default function MasterClientEntryPage() {
  // ============================================
  // [BLOCK 3 START: STATE & HANDLERS]
  // ============================================
  const [entries, setEntries] = useState<ClientReportEntry[]>(initialEntries);
  const [form, setForm] = useState<Omit<ClientReportEntry, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof ClientReportEntry>("reportDate");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

const [alert, setAlert] = useState<
  { id: number; type: AlertColor; message: string } | null
>(null);

const showAlert = (type: AlertColor, message: string) => {
  setAlert({ id: Date.now(), type, message });
};

  // Filtered & Sorted Records
  const filteredEntries = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = entries.filter((item) => {
      const searchMatch = [
        item.clientName,
        item.hospitalName,
        item.productName,
        item.groupName,
        item.customerType,
        item.reportDate,
      ].some((val) => String(val).toLowerCase().includes(keyword));

      const typeMatch =
        customerTypeFilter === "all" ||
        item.customerType === customerTypeFilter;

      return searchMatch && typeMatch;
    });

    return [...result].sort(getComparator(order, orderBy));
  }, [entries, search, customerTypeFilter, order, orderBy]);

  const paginatedEntries = filteredEntries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (property: keyof ClientReportEntry) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: ClientReportEntry) => {
    setEditingId(item.id);
    setForm({
      reportDate: item.reportDate,
      customerType: item.customerType,
      hospitalName: item.hospitalName,
      productName: item.productName,
      clientName: item.clientName,
      groupName: item.groupName,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const requiredKeys: (keyof Omit<ClientReportEntry, "id">)[] = [
      "reportDate",
      "customerType",
      "clientName",
      "hospitalName",
      "productName",
      "groupName",
    ];

    if (requiredKeys.some((k) => String(form[k]).trim() === "")) {
      return showAlert("error", "Please fill all required fields.");
    }

    const payload: Omit<ClientReportEntry, "id"> = {
      reportDate: form.reportDate.trim(),
      customerType: form.customerType,
      hospitalName: form.hospitalName.trim(),
      productName: form.productName.trim(),
      clientName: form.clientName.trim(),
      groupName: form.groupName.trim(),
    };

    if (editingId !== null) {
      setEntries((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...payload } : e))
      );
      showAlert("success", "Client report entry updated successfully!");
    } else {
      setEntries((prev) => [{ ...payload, id: Date.now() }, ...prev]);
      setPage(0);
      showAlert("success", "Client report generated successfully!");
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setPage(0);
    showAlert("success", "Entry deleted successfully!");
  };

  // Export single row as CSV report
  const handleDownloadReport = (item: ClientReportEntry) => {
    const headers = [
      "Date",
      "Customer Type",
      "Client Name",
      "Hospital Name",
      "Product Name",
      "Group Name",
    ];
    const row = [
      item.reportDate,
      item.customerType,
      item.clientName,
      item.hospitalName,
      item.productName,
      item.groupName,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);

    const csv = `${headers.join(",")}\n${row.join(",")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.clientName.replace(/\s+/g, "_")}_Report.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showAlert("success", "Client report downloaded!");
  };

  const handleResetFilters = () => {
    setSearch("");
    setCustomerTypeFilter("all");
    setOrder("desc");
    setOrderBy("reportDate");
    setPage(0);
  };
  // [BLOCK 3 END: STATE & HANDLERS]

  const columns: { id: keyof ClientReportEntry; label: string }[] = [
    { id: "clientName", label: "Client & Type" },
    { id: "hospitalName", label: "Hospital Name" },
    { id: "productName", label: "Product Name" },
    { id: "groupName", label: "Group Name" },
    { id: "reportDate", label: "Date" },
  ];

  // Shared form fields helper (keeps Main Form & Edit Dialog DRY)
  const renderFormFields = (isDialog = false) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isDialog
          ? { xs: "1fr", sm: "repeat(2, 1fr)" }
          : { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: 2,
      }}
    >
      {/* i. Date */}
      <TextField
        fullWidth
        size="small"
        label="Date *"
        name="reportDate"
        type="text"
        value={form.reportDate}
        onChange={handleChange}
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => {
          if (!e.target.value) e.target.type = "text";
        }}
        placeholder="YYYY-MM-DD (e.g. 2026-11-18)"
        InputLabelProps={{ shrink: true }}
      />

      {/* CRM Customer Type */}
      <TextField
        fullWidth
        size="small"
        select
        label="Customer Type *"
        name="customerType"
        value={form.customerType}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        SelectProps={{ displayEmpty: true }}
      >
        <MenuItem value="" disabled>
          <Typography variant="body2" color="text.disabled">
            Select type (Pharmacy, Hospital, Clinic...)
          </Typography>
        </MenuItem>
        {CUSTOMER_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      {/* v. Client Name */}
      <TextField
        fullWidth
        size="small"
        label="Client Name *"
        name="clientName"
        value={form.clientName}
        onChange={handleChange}
        placeholder="e.g. Al-Shifa Pharmacy / Dr. Tariq"
        InputLabelProps={{ shrink: true }}
      />

      {/* vi. Group Name */}
      <TextField
        fullWidth
        size="small"
        label="Group Name *"
        name="groupName"
        value={form.groupName}
        onChange={handleChange}
        placeholder="e.g. Institutional / Retail Chain"
        InputLabelProps={{ shrink: true }}
      />

      {/* iii. Hospital Name */}
      <TextField
        fullWidth
        size="small"
        label="Hospital Name *"
        name="hospitalName"
        value={form.hospitalName}
        onChange={handleChange}
        placeholder="e.g. Aga Khan Hospital (or N/A)"
        InputLabelProps={{ shrink: true }}
        sx={{
          gridColumn: isDialog
            ? { xs: "1 / -1", sm: "span 1" }
            : { xs: "1 / -1", sm: "span 1", lg: "span 2" },
        }}
      />

      {/* iv. Product Name */}
      <TextField
        fullWidth
        size="small"
        label="Product Name *"
        name="productName"
        value={form.productName}
        onChange={handleChange}
        placeholder="e.g. Augmentin 625mg / Panadol Extra"
        InputLabelProps={{ shrink: true }}
        sx={{
          gridColumn: isDialog
            ? { xs: "1 / -1", sm: "span 1" }
            : { xs: "1 / -1", sm: "span 1", lg: "span 2" },
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        pb: 4,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {alert && (
        <Alert
    key={alert.id}          
    id={alert.id}           
    type={alert.type}
    message={alert.message}
  />
      )}

      {/* ============================================ */}
      {/* [BLOCK 4 START: PAGE HEADER]                 */}
      {/* ============================================ */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Master Client Entry (Report Generator)
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Enter pharmacy distribution client details and generate reports.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            px: 2.5,
            whiteSpace: "nowrap",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          New Client Report
        </Button>
      </Stack>
      {/* [BLOCK 4 END: PAGE HEADER] */}

      {/* ============================================ */}
      {/* [BLOCK 5 START: ENTRY & REPORT FORM CARD]    */}
      {/* ============================================ */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8edf3",
          borderRadius: 3,
          mb: 3,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}>
              <AssessmentOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Client & Report Parameters
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Configure date, hospital, product, client, and group details.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography fontWeight={700} color="#2563eb" mb={2}>
            Report Configuration
          </Typography>

          {renderFormFields(false)}

          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="flex-end"
              spacing={1.5}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setForm(emptyForm)}
                startIcon={<Refresh />}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Reset Form
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadOutlined />}
                onClick={handleSave}
                sx={{
                  bgcolor: "#2563eb",
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "none",
                }}
              >
                Generate Report
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      {/* [BLOCK 5 END: ENTRY & REPORT FORM CARD] */}

      {/* ============================================ */}
      {/* [BLOCK 6 START: REPORT TABLE & FILTERS]      */}
      {/* ============================================ */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8edf3",
          borderRadius: 3,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box mb={2.5}>
            <Typography variant="h6" fontWeight={700}>
              Generated Client Reports
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, filter by customer type, edit, and export client reports.
            </Typography>
          </Box>

          {/* Search & Filter */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr auto" },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search client, hospital, product, group..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Customer Type</InputLabel>
              <Select
                value={customerTypeFilter}
                label="Customer Type"
                onChange={(e) => {
                  setCustomerTypeFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Customer Types</MenuItem>
                {CUSTOMER_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Reset Filters">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{ height: 40, minWidth: 40 }}
                >
                  <Refresh />
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Responsive Table */}
          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedEntries.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          variant="rounded"
                          sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}
                        >
                          <DescriptionOutlined />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body2">
                            {item.clientName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.customerType}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {item.hospitalName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{item.productName}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={item.groupName}
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item.reportDate}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Download CSV Report">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadReport(item)}
                            sx={{ color: "#2563eb" }}
                          >
                            <DownloadOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(item)}
                            sx={{ color: "#475569" }}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item.id)}
                            sx={{ color: "#dc2626" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <DescriptionOutlined
                        sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography fontWeight={700}>No Entries Found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredEntries.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              ".MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
              },
            }}
          />
        </CardContent>
      </Card>
      {/* [BLOCK 6 END: REPORT TABLE & FILTERS] */}

      {/* ============================================ */}
      {/* [BLOCK 7 START: ADD / EDIT MODAL DIALOG]     */}
      {/* ============================================ */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3, mx: 2, width: "100%" } }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={700} variant="h6">
                {editingId !== null ? "Edit Client Entry" : "New Client Report"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {editingId !== null
                  ? "Update client report parameters."
                  : "Enter client details to generate a report."}
              </Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>{renderFormFields(true)}</DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#2563eb", textTransform: "none", boxShadow: "none" }}
          >
            {editingId !== null ? "Update Entry" : "Generate Report"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* [BLOCK 7 END: ADD / EDIT MODAL DIALOG] */}
    </Box>
  );
}